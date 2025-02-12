import qs from 'qs';
import normalize from 'json-api-normalizer';
import merge from 'deepmerge';
import { Action } from 'redux';
import type { ApiRecord } from '../index.d';

export { getRecord, getRelationship } from './selectors';

export const CLEAR_RECORDS = 'redux-json-api-module/api/CLEAR_RECORDS';
export const FETCH_RECORDS = 'redux-json-api-module/api/FETCH_RECORDS';
export const FETCH_RECORDS_SUCCESS = 'redux-json-api-module/api/FETCH_RECORDS_SUCCESS';
export const SAVE_RECORD = 'redux-json-api-module/api/SAVE_RECORD';
export const SAVE_RECORD_SUCCESS = 'redux-json-api-module/api/SAVE_RECORD_SUCCESS';
export const DELETE_RECORD = 'redux-json-api-module/api/DELETE_RECORD';
export const DELETE_RECORD_FAIL = 'redux-json-api-module/api/DELETE_RECORD_FAIL';

interface State {
  loading: boolean;
  [key: string]: any;
}

const INITIAL_STATE: State = {
  loading: false,
};

const arrayMerge = (a: any[], b: any[]) => b;

const resultMerge = (state: State, resp: any) => {
  if (!resp.data) return state;

  const newState = { ...state };
  const normalizedResp = normalize(resp, { camelizeKeys: false, camelizeTypeValues: false });

  return merge(
    newState,
    normalizedResp,
    { arrayMerge }
  );
};

export default function reducer(state: State = INITIAL_STATE, action: Action & { [key: string]: any }): State {
  switch (action.type) {
    case CLEAR_RECORDS:
      return { ...state, [action.record_type]: {} };

    case FETCH_RECORDS_SUCCESS:
      return resultMerge(state, action.payload.data).merge({ loading: false });

    case SAVE_RECORD_SUCCESS:
      return resultMerge(state, action.payload.data).merge({ loading: false });

    case DELETE_RECORD:
      const recs = { ...state[action.record.type] };
      delete recs[action.record.id];

      return { ...state, [action.record.type]: recs };

    case DELETE_RECORD_FAIL:
      return resultMerge(state, { data: action.meta.previousAction.record }).merge({ loading: false });

    default:
      return state;
  }
}

export const queryString = (params: any) => qs.stringify(params, { arrayFormat: 'brackets' });

export function clearRecords(type: string): object {
  return {
    type: CLEAR_RECORDS,
    record_type: type,
  };
}

export function fetchRecords(type: string, params: object = {}): object {
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: `/${type}?${queryString(params)}`,
      },
    },
  };
}

export function fetchRecord(type: string, id: any, params: object = {}): object {
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: `/${type}/${id}?${queryString(params)}`,
      },
    },
  };
}

export function saveRecord(record: ApiRecord, options: { ignoreFail?: boolean; params?: object } = {}): object {
  console.info('saving record', record, options);

  const method = record.id ? 'PATCH' : 'POST';
  let url = `/${record.type}`;

  if (record.id) url += `/${record.id}`;

  return {
    type: SAVE_RECORD,
    ignoreFail: options.ignoreFail,
    payload: {
      request: {
        method,
        url: `${url}?${queryString(options.params || {})}`,
        data: { data: record },
      },
    },
  };
}

export function deleteRecord(record: ApiRecord): object {
  return {
    type: DELETE_RECORD,
    record,
    payload: {
      request: {
        method: 'DELETE',
        url: `${record.type}/${record.id}`,
      },
    },
  };
}