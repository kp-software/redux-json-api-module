"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelationship = exports.getRecord = void 0;
var emptyRecords = {};
var getType = function getType(api, _ref) {
  var type = _ref.type;
  return api[type] || emptyRecords;
};
var findRecord = function findRecord(records, id) {
  return records[id] || records[String(id)] || null;
};
var getRecord = exports.getRecord = function getRecord(api, _ref2) {
  var type = _ref2.type,
    id = _ref2.id;
  return findRecord(getType(api, {
    type: type
  }), id);
};
var getRelationship = exports.getRelationship = function getRelationship(api, relationship) {
  if (!relationship || !relationship.data) return null;
  if (Array.isArray(relationship.data)) {
    return relationship.data.map(function (rel) {
      return getRecord(api, rel);
    }).filter(function (rel) {
      return rel;
    });
  }
  return getRecord(api, relationship.data);
};