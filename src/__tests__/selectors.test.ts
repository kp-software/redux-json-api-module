import { describe, it, expect } from 'vitest';
import { getRecord, getRelationship } from '../selectors';

describe('getRecord', () => {
  it('returns the record when it exists', () => {
    const record = { id: '1', type: 'articles', attributes: { title: 'A' } };
    const api = { articles: { '1': record } };

    expect(getRecord(api, { type: 'articles', id: '1' })).toBe(record);
  });

  it('returns null when the type does not exist', () => {
    const api = {};

    expect(getRecord(api, { type: 'articles', id: '1' })).toBeNull();
  });

  it('returns null when the id does not exist', () => {
    const record = { id: '2', type: 'articles', attributes: {} };
    const api = { articles: { '2': record } };

    expect(getRecord(api, { type: 'articles', id: '1' })).toBeNull();
  });

  it('finds record by numeric id via String coercion', () => {
    const record = { id: '5', type: 'articles', attributes: { title: 'Found' } };
    const api = { articles: { '5': record } };

    expect(getRecord(api, { type: 'articles', id: 5 })).toBe(record);
  });

  it('returns null when both direct and string lookups miss', () => {
    const record = { id: '1', type: 'articles', attributes: {} };
    const api = { articles: { '1': record } };

    expect(getRecord(api, { type: 'articles', id: 99 })).toBeNull();
  });
});

describe('getRelationship', () => {
  it('returns null for null relationship', () => {
    expect(getRelationship({}, null as any)).toBeNull();
  });

  it('returns null for undefined relationship', () => {
    expect(getRelationship({}, undefined as any)).toBeNull();
  });

  it('returns null when relationship.data is missing', () => {
    expect(getRelationship({}, {} as any)).toBeNull();
  });

  it('returns the record for a single-object relationship', () => {
    const author = { id: '2', type: 'people', attributes: { name: 'Dan' } };
    const api = { people: { '2': author } };
    const relationship = { data: { id: '2', type: 'people', attributes: {} } };

    expect(getRelationship(api, relationship)).toBe(author);
  });

  it('returns null for a single-object relationship when record not in store', () => {
    const api = {};
    const relationship = { data: { id: '2', type: 'people', attributes: {} } };

    expect(getRelationship(api, relationship)).toBeNull();
  });

  it('returns array of records for array relationship', () => {
    const tag1 = { id: '1', type: 'tags', attributes: { name: 'js' } };
    const tag2 = { id: '2', type: 'tags', attributes: { name: 'ts' } };
    const api = { tags: { '1': tag1, '2': tag2 } };
    const relationship = {
      data: [
        { id: '1', type: 'tags', attributes: {} },
        { id: '2', type: 'tags', attributes: {} },
      ],
    };

    expect(getRelationship(api, relationship)).toEqual([tag1, tag2]);
  });

  it('filters out null entries from array relationship', () => {
    const tag1 = { id: '1', type: 'tags', attributes: { name: 'js' } };
    const api = { tags: { '1': tag1 } };
    const relationship = {
      data: [
        { id: '1', type: 'tags', attributes: {} },
        { id: '99', type: 'tags', attributes: {} },
      ],
    };

    expect(getRelationship(api, relationship)).toEqual([tag1]);
  });

  it('returns empty array when no array relationship records exist', () => {
    const api = {};
    const relationship = {
      data: [{ id: '1', type: 'tags', attributes: {} }],
    };

    expect(getRelationship(api, relationship)).toEqual([]);
  });

  it('returns null when single relationship data.id is undefined', () => {
    const api = { people: { '1': { id: '1', type: 'people', attributes: {} } } };
    const relationship = { data: { type: 'people', attributes: {} } };

    expect(getRelationship(api, relationship as any)).toBeNull();
  });

  it('filters out array entries where id is undefined', () => {
    const tag1 = { id: '1', type: 'tags', attributes: { name: 'js' } };
    const api = { tags: { '1': tag1 } };
    const relationship = {
      data: [
        { type: 'tags', attributes: {} } as any,
        { id: '1', type: 'tags', attributes: {} },
      ],
    };

    expect(getRelationship(api, relationship)).toEqual([tag1]);
  });
});
