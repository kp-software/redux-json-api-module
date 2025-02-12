"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationship = exports.getRecord = void 0;
var emptyRecords = {};
var getType = function (api, _a) {
    var type = _a.type;
    return api[type] || emptyRecords;
};
var findRecord = function (records, id) { return records[id] || records[String(id)] || null; };
var getRecord = function (api, _a) {
    var type = _a.type, id = _a.id;
    return findRecord(getType(api, { type: type }), id);
};
exports.getRecord = getRecord;
var getRelationship = function (api, relationship) {
    if (!relationship || !relationship.data)
        return null;
    if (Array.isArray(relationship.data)) {
        return relationship.data
            .map(function (rel) { return rel.id !== undefined ? (0, exports.getRecord)(api, rel) : null; })
            .filter(function (rel) { return rel; });
    }
    return relationship.data.id !== undefined ? (0, exports.getRecord)(api, relationship.data) : null;
};
exports.getRelationship = getRelationship;
