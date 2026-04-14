import type { ApiStore, ApiRecord, RecordSet, Relationship } from '../index';

const emptyRecords: RecordSet = {};

const getType = (api: ApiStore, { type }: { type: string }) => api[type] || emptyRecords;

const findRecord = (records: RecordSet, id: string | number) => records[id] || records[String(id)] || null;

export const getRecord = (api: ApiStore, { type, id }: { type: string; id: string | number }) => findRecord(getType(api, { type }), id);

export const getRelationship = (api: ApiStore, relationship: Relationship) => {
  if (!relationship || !relationship.data) return null;

  if (Array.isArray(relationship.data)) {
    return relationship.data
        .map((rel: ApiRecord) => rel.id != null ? getRecord(api, { type: rel.type, id: rel.id as string | number }) : null)
        .filter((rel: ApiRecord | null) => rel);
  }

  if (relationship.data.id !== undefined){
     return getRecord(api, { type: relationship.data.type, id: relationship.data.id as string | number })
  }

  return null
};