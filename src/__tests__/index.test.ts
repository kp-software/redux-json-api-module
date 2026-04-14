import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import reducer, {
  CLEAR_RECORDS,
  FETCH_RECORDS,
  FETCH_RECORDS_SUCCESS,
  SAVE_RECORD,
  SAVE_RECORD_SUCCESS,
  DELETE_RECORD,
  DELETE_RECORD_FAIL,
  queryString,
  clearRecords,
  fetchRecords,
  fetchRecord,
  saveRecord,
  deleteRecord,
  getRecord,
  getRelationship,
} from '../index';

describe('action type constants', () => {
  it('exports correct CLEAR_RECORDS', () => {
    expect(CLEAR_RECORDS).toBe('redux-json-api-module/api/CLEAR_RECORDS');
  });

  it('exports correct FETCH_RECORDS', () => {
    expect(FETCH_RECORDS).toBe('redux-json-api-module/api/FETCH_RECORDS');
  });

  it('exports correct FETCH_RECORDS_SUCCESS', () => {
    expect(FETCH_RECORDS_SUCCESS).toBe('redux-json-api-module/api/FETCH_RECORDS_SUCCESS');
  });

  it('exports correct SAVE_RECORD', () => {
    expect(SAVE_RECORD).toBe('redux-json-api-module/api/SAVE_RECORD');
  });

  it('exports correct SAVE_RECORD_SUCCESS', () => {
    expect(SAVE_RECORD_SUCCESS).toBe('redux-json-api-module/api/SAVE_RECORD_SUCCESS');
  });

  it('exports correct DELETE_RECORD', () => {
    expect(DELETE_RECORD).toBe('redux-json-api-module/api/DELETE_RECORD');
  });

  it('exports correct DELETE_RECORD_FAIL', () => {
    expect(DELETE_RECORD_FAIL).toBe('redux-json-api-module/api/DELETE_RECORD_FAIL');
  });
});

describe('re-exports', () => {
  it('re-exports getRecord from selectors', () => {
    expect(typeof getRecord).toBe('function');
  });

  it('re-exports getRelationship from selectors', () => {
    expect(typeof getRelationship).toBe('function');
  });
});

describe('queryString', () => {
  it('returns empty string for empty object', () => {
    expect(queryString({})).toBe('');
  });

  it('encodes simple params', () => {
    expect(queryString({ page: 1 })).toBe('page=1');
  });

  it('encodes arrays with brackets format', () => {
    const result = queryString({ include: ['author', 'tags'] });
    expect(result).toContain('include%5B%5D=author');
    expect(result).toContain('include%5B%5D=tags');
  });

  it('encodes nested objects', () => {
    const result = queryString({ filter: { name: 'foo' } });
    expect(result).toBe('filter%5Bname%5D=foo');
  });
});

describe('clearRecords', () => {
  it('returns action with CLEAR_RECORDS type and record_type', () => {
    expect(clearRecords('articles')).toEqual({
      type: CLEAR_RECORDS,
      record_type: 'articles',
    });
  });
});

describe('fetchRecords', () => {
  it('returns FETCH_RECORDS action with GET method and type URL', () => {
    const action = fetchRecords('articles') as any;
    expect(action.type).toBe(FETCH_RECORDS);
    expect(action.payload.request.method).toBe('GET');
    expect(action.payload.request.url).toBe('/articles?');
  });

  it('appends query string from params', () => {
    const action = fetchRecords('articles', { page: 2 }) as any;
    expect(action.payload.request.url).toBe('/articles?page=2');
  });

  it('defaults params to empty object', () => {
    const action = fetchRecords('articles') as any;
    expect(action.payload.request.url).toMatch(/\/articles\?$/);
  });

  it('sets replace on action when options.replace is true', () => {
    const action = fetchRecords('articles', {}, { replace: true }) as any;
    expect(action.replace).toBe(true);
  });

  it('does not set replace on action when options not provided', () => {
    const action = fetchRecords('articles') as any;
    expect(action.replace).toBeUndefined();
  });

  it('does not set replace on action when options.replace is false', () => {
    const action = fetchRecords('articles', {}, { replace: false }) as any;
    expect(action.replace).toBeUndefined();
  });
});

describe('fetchRecord', () => {
  it('returns FETCH_RECORDS action with id in URL', () => {
    const action = fetchRecord('articles', 5) as any;
    expect(action.type).toBe(FETCH_RECORDS);
    expect(action.payload.request.method).toBe('GET');
    expect(action.payload.request.url).toBe('/articles/5?');
  });

  it('appends query string from params', () => {
    const action = fetchRecord('articles', 5, { include: 'author' }) as any;
    expect(action.payload.request.url).toBe('/articles/5?include=author');
  });

  it('sets replace on action when options.replace is true', () => {
    const action = fetchRecord('articles', 5, {}, { replace: true }) as any;
    expect(action.replace).toBe(true);
  });

  it('does not set replace on action when options not provided', () => {
    const action = fetchRecord('articles', 5) as any;
    expect(action.replace).toBeUndefined();
  });
});

describe('saveRecord', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it('uses POST method when record has no id', () => {
    const record = { id: null, type: 'articles', attributes: { title: 'New' } };
    const action = saveRecord(record) as any;

    expect(action.payload.request.method).toBe('POST');
    expect(action.payload.request.url).toBe('/articles?');
  });

  it('uses PATCH method when record has an id', () => {
    const record = { id: '3', type: 'articles', attributes: { title: 'Edit' } };
    const action = saveRecord(record) as any;

    expect(action.payload.request.method).toBe('PATCH');
    expect(action.payload.request.url).toBe('/articles/3?');
  });

  it('wraps record in data key in request payload', () => {
    const record = { id: '1', type: 'articles', attributes: { title: 'A' } };
    const action = saveRecord(record) as any;

    expect(action.payload.request.data).toEqual({ data: record });
  });

  it('sets ignoreFail from options', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const action = saveRecord(record, { ignoreFail: true }) as any;

    expect(action.ignoreFail).toBe(true);
  });

  it('appends params from options to URL', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const action = saveRecord(record, { params: { include: 'author' } }) as any;

    expect(action.payload.request.url).toContain('include=author');
  });

  it('calls console.info with record and options', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const options = { ignoreFail: true };
    saveRecord(record, options);

    expect(infoSpy).toHaveBeenCalledWith('saving record', record, options);
  });

  it('returns SAVE_RECORD action type', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const action = saveRecord(record) as any;

    expect(action.type).toBe(SAVE_RECORD);
  });

  it('sets replace on action when options.replace is true', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const action = saveRecord(record, { replace: true }) as any;
    expect(action.replace).toBe(true);
  });

  it('does not set replace on action when replace not in options', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const action = saveRecord(record, { ignoreFail: true }) as any;
    expect(action.replace).toBeUndefined();
  });
});

describe('deleteRecord', () => {
  it('returns DELETE_RECORD action with record and DELETE request', () => {
    const record = { id: '5', type: 'articles', attributes: {} };
    const action = deleteRecord(record) as any;

    expect(action.type).toBe(DELETE_RECORD);
    expect(action.record).toBe(record);
    expect(action.payload.request.method).toBe('DELETE');
  });

  it('builds URL without leading slash', () => {
    const record = { id: '5', type: 'articles', attributes: {} };
    const action = deleteRecord(record) as any;

    expect(action.payload.request.url).toBe('articles/5');
  });
});

describe('reducer', () => {
  describe('initial state', () => {
    it('returns initial state for unknown action', () => {
      const state = reducer(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual({ loading: false });
    });

    it('returns current state for unrecognized action type', () => {
      const existingState = { loading: false, articles: { '1': { id: '1', type: 'articles' } } };
      const state = reducer(existingState, { type: 'UNRELATED' });
      expect(state).toBe(existingState);
    });
  });

  describe('CLEAR_RECORDS', () => {
    it('clears a record type to empty object', () => {
      const initial = {
        loading: false,
        articles: { '1': { id: '1', type: 'articles', attributes: { title: 'A' } } },
      };

      const state = reducer(initial, clearRecords('articles') as any);
      expect(state.articles).toEqual({});
    });

    it('does not affect other record types', () => {
      const people = { '1': { id: '1', type: 'people', attributes: { name: 'Dan' } } };
      const initial = {
        loading: false,
        articles: { '1': { id: '1', type: 'articles', attributes: {} } },
        people,
      };

      const state = reducer(initial, clearRecords('articles') as any);
      expect(state.people).toBe(people);
    });

    it('works when the type does not exist in state', () => {
      const initial = { loading: false };
      const state = reducer(initial, clearRecords('articles') as any);
      expect(state.articles).toEqual({});
    });
  });

  describe('FETCH_RECORDS_SUCCESS', () => {
    it('normalizes payload data and merges into state', () => {
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [
              { id: '1', type: 'articles', attributes: { title: 'A' } },
            ],
          },
        },
      };

      const state = reducer({ loading: true }, action);
      expect(state.articles['1'].attributes.title).toBe('A');
      expect(state.loading).toBe(false);
    });

    it('deep merges with existing state', () => {
      const initial = {
        loading: true,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'Existing' } },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [
              { id: '2', type: 'articles', attributes: { title: 'New' } },
            ],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1']).toBeDefined();
      expect(state.articles['2']).toBeDefined();
    });

    it('sets loading to false', () => {
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [{ id: '1', type: 'articles', attributes: {} }],
          },
        },
      };

      const state = reducer({ loading: true }, action);
      expect(state.loading).toBe(false);
    });

    it('returns state with loading false when payload has no data', () => {
      const initial = { loading: true, articles: { '1': { id: '1', type: 'articles' } } };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: { data: {} },
      };

      const state = reducer(initial, action);
      expect(state.loading).toBe(false);
      expect(state.articles['1']).toBeDefined();
    });

    it('processes included resources', () => {
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [{ id: '1', type: 'articles', attributes: { title: 'A' } }],
            included: [{ id: '10', type: 'people', attributes: { name: 'Dan' } }],
          },
        },
      };

      const state = reducer({ loading: true }, action);
      expect(state.articles['1']).toBeDefined();
      expect(state.people['10'].attributes.name).toBe('Dan');
    });

    it('replaces individual records instead of deep merging when replace is true', () => {
      const initial = {
        loading: true,
        articles: {
          '1': {
            id: '1',
            type: 'articles',
            attributes: { title: 'Old Title', body: 'Old Body' },
          },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        meta: { previousAction: { replace: true } },
        payload: {
          data: {
            data: [
              { id: '1', type: 'articles', attributes: { title: 'New Title' } },
            ],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('New Title');
      expect(state.articles['1'].attributes.body).toBeUndefined();
    });

    it('preserves records not in the response when replace is true', () => {
      const initial = {
        loading: true,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'Stays' } },
          '2': { id: '2', type: 'articles', attributes: { title: 'Also stays' } },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        meta: { previousAction: { replace: true } },
        payload: {
          data: {
            data: [
              { id: '1', type: 'articles', attributes: { title: 'Updated' } },
            ],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('Updated');
      expect(state.articles['2'].attributes.title).toBe('Also stays');
    });

    it('still deep merges by default when replace is not set', () => {
      const initial = {
        loading: true,
        articles: {
          '1': {
            id: '1',
            type: 'articles',
            attributes: { title: 'Old', body: 'Preserved' },
          },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [
              { id: '1', type: 'articles', attributes: { title: 'New' } },
            ],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('New');
      expect(state.articles['1'].attributes.body).toBe('Preserved');
    });

    it('handles replace with included resources', () => {
      const initial = {
        loading: true,
        people: {
          '10': { id: '10', type: 'people', attributes: { name: 'Old', age: 30 } },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        meta: { previousAction: { replace: true } },
        payload: {
          data: {
            data: [{ id: '1', type: 'articles', attributes: { title: 'A' } }],
            included: [{ id: '10', type: 'people', attributes: { name: 'New' } }],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.people['10'].attributes.name).toBe('New');
      expect(state.people['10'].attributes.age).toBeUndefined();
    });

    it('preserves other resource types not in the response when replace is true', () => {
      const initial = {
        loading: true,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'Existing' } },
        },
        people: {
          '10': { id: '10', type: 'people', attributes: { name: 'Dan' } },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        meta: { previousAction: { replace: true } },
        payload: {
          data: {
            data: [{ id: '1', type: 'articles', attributes: { title: 'Updated' } }],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('Updated');
      expect(state.people['10'].attributes.name).toBe('Dan');
    });
  });

  describe('SAVE_RECORD_SUCCESS', () => {
    it('normalizes and merges saved record into state', () => {
      const action = {
        type: SAVE_RECORD_SUCCESS,
        payload: {
          data: {
            data: { id: '1', type: 'articles', attributes: { title: 'Saved' } },
          },
        },
      };

      const state = reducer({ loading: true }, action);
      expect(state.articles['1'].attributes.title).toBe('Saved');
      expect(state.loading).toBe(false);
    });

    it('replaces record when replace is true', () => {
      const initial = {
        loading: true,
        articles: {
          '1': {
            id: '1',
            type: 'articles',
            attributes: { title: 'Old', body: 'Should disappear' },
          },
        },
      };
      const action = {
        type: SAVE_RECORD_SUCCESS,
        meta: { previousAction: { replace: true } },
        payload: {
          data: {
            data: { id: '1', type: 'articles', attributes: { title: 'Saved' } },
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('Saved');
      expect(state.articles['1'].attributes.body).toBeUndefined();
    });

    it('deep merges saved record by default', () => {
      const initial = {
        loading: true,
        articles: {
          '1': {
            id: '1',
            type: 'articles',
            attributes: { title: 'Old', body: 'Kept' },
          },
        },
      };
      const action = {
        type: SAVE_RECORD_SUCCESS,
        payload: {
          data: {
            data: { id: '1', type: 'articles', attributes: { title: 'New' } },
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('New');
      expect(state.articles['1'].attributes.body).toBe('Kept');
    });
  });

  describe('DELETE_RECORD', () => {
    it('removes record from state by type and id', () => {
      const initial = {
        loading: false,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'A' } },
          '2': { id: '2', type: 'articles', attributes: { title: 'B' } },
        },
      };
      const action = {
        type: DELETE_RECORD,
        record: { type: 'articles', id: '1' },
        payload: { request: { method: 'DELETE', url: 'articles/1' } },
      };

      const state = reducer(initial, action);
      expect(state.articles['1']).toBeUndefined();
      expect(state.articles['2']).toBeDefined();
    });

    it('handles deleting a record that does not exist', () => {
      const initial = {
        loading: false,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'A' } },
        },
      };
      const action = {
        type: DELETE_RECORD,
        record: { type: 'articles', id: '99' },
        payload: { request: { method: 'DELETE', url: 'articles/99' } },
      };

      const state = reducer(initial, action);
      expect(state.articles['1']).toBeDefined();
    });
  });

  describe('DELETE_RECORD_FAIL', () => {
    it('restores the deleted record from meta.previousAction', () => {
      const initial = {
        loading: true,
        articles: {},
      };
      const action = {
        type: DELETE_RECORD_FAIL,
        meta: {
          previousAction: {
            record: { id: '1', type: 'articles', attributes: { title: 'Restored' } },
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.title).toBe('Restored');
      expect(state.loading).toBe(false);
    });
  });

  describe('arrayMerge behavior', () => {
    it('replaces arrays instead of concatenating during merge', () => {
      const initial = {
        loading: false,
        articles: {
          '1': { id: '1', type: 'articles', attributes: { tags: ['old'] } },
        },
      };
      const action = {
        type: FETCH_RECORDS_SUCCESS,
        payload: {
          data: {
            data: [
              { id: '1', type: 'articles', attributes: { tags: ['new'] } },
            ],
          },
        },
      };

      const state = reducer(initial, action);
      expect(state.articles['1'].attributes.tags).toEqual(['new']);
    });
  });
});
