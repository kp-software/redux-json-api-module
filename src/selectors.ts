import type { ApiRecord, Relationship } from '../index.d';

const emptyRecords: ApiRecord<string, any> = {};

const getType = (api: ApiRecord<string, any>, { type }: { type: string }) => api[type] || emptyRecords;

const findRecord = (records: ApiRecord<string, any>, id: string | number) => records[id] || records[String(id)] || null;

export const getRecord = (api: ApiRecord<string, any>, { type, id }: { type: string; id: string | number }) => findRecord(getType(api, { type }), id);

export const getRelationship = (api: ApiRecord<string, any>, relationship: Relationship) => {
  if (!relationship || !relationship.data) return null;

  if (Array.isArray(relationship.data)) {
    return relationship.data
        .map(rel => rel.id !== undefined ? getRecord(api, rel) : null)
        .filter(rel => rel);
  }

  return relationship.data.id !== undefined ? getRecord(api, relationship.data) : null;
};