const emptyRecords = {};
const getType = (api, { type }) => api[type] || emptyRecords;
const findRecord = (records, id) => records[id] || records[String(id)] || null;

export const getRecord = (api, { type, id }) => findRecord(getType(api, { type }), id);

export const getRelationship = (api, relationship) => {
  if (!relationship.data) return null;

  if (Array.isArray(relationship.data)) {
    return relationship.data
      .map(rel => getRecord(api, rel))
      .filter(rel => rel);
  }

  const included = api[relationship.data.type] || {};
  return included[relationship.data.id] || null;
};
