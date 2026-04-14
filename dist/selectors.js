"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationship = exports.getRecord = void 0;
const emptyRecords = {};
const getType = (api, { type }) => api[type] || emptyRecords;
const findRecord = (records, id) => records[id] || records[String(id)] || null;
const getRecord = (api, { type, id }) => findRecord(getType(api, { type }), id);
exports.getRecord = getRecord;
const getRelationship = (api, relationship) => {
    if (!relationship || !relationship.data)
        return null;
    if (Array.isArray(relationship.data)) {
        return relationship.data
            .map((rel) => rel.id !== undefined ? (0, exports.getRecord)(api, { type: rel.type, id: rel.id }) : null)
            .filter((rel) => rel);
    }
    if (relationship.data.id !== undefined) {
        return (0, exports.getRecord)(api, { type: relationship.data.type, id: relationship.data.id });
    }
    return null;
};
exports.getRelationship = getRelationship;
