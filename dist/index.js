"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  CLEAR_RECORDS: true,
  FETCH_RECORDS: true,
  FETCH_RECORDS_SUCCESS: true,
  SAVE_RECORD: true,
  SAVE_RECORD_SUCCESS: true,
  DELETE_RECORD: true,
  DELETE_RECORD_FAIL: true,
  queryString: true,
  clearRecords: true,
  fetchRecords: true,
  fetchRecord: true,
  saveRecord: true,
  deleteRecord: true
};
exports.SAVE_RECORD_SUCCESS = exports.SAVE_RECORD = exports.FETCH_RECORDS_SUCCESS = exports.FETCH_RECORDS = exports.DELETE_RECORD_FAIL = exports.DELETE_RECORD = exports.CLEAR_RECORDS = void 0;
exports.clearRecords = clearRecords;
exports["default"] = reducer;
exports.deleteRecord = deleteRecord;
exports.fetchRecord = fetchRecord;
exports.fetchRecords = fetchRecords;
exports.queryString = void 0;
exports.saveRecord = saveRecord;
var _qs = _interopRequireDefault(require("qs"));
var _selectors = require("./selectors");
Object.keys(_selectors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _selectors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _selectors[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CLEAR_RECORDS = exports.CLEAR_RECORDS = 'redux-json-api-module/api/CLEAR_RECORDS';
var FETCH_RECORDS = exports.FETCH_RECORDS = 'redux-json-api-module/api/FETCH_RECORDS';
var FETCH_RECORDS_SUCCESS = exports.FETCH_RECORDS_SUCCESS = 'redux-json-api-module/api/FETCH_RECORDS_SUCCESS';
var SAVE_RECORD = exports.SAVE_RECORD = 'redux-json-api-module/api/SAVE_RECORD';
var SAVE_RECORD_SUCCESS = exports.SAVE_RECORD_SUCCESS = 'redux-json-api-module/api/SAVE_RECORD_SUCCESS';
var DELETE_RECORD = exports.DELETE_RECORD = 'redux-json-api-module/api/DELETE_RECORD';
var DELETE_RECORD_FAIL = exports.DELETE_RECORD_FAIL = 'redux-json-api-module/api/DELETE_RECORD_FAIL';
var INITIAL_STATE = {
  loading: false
};
var mergeResult = function mergeResult(state, resp) {
  if (!resp.data) return state;
  var _mergeDeep = function mergeDeep(target, source) {
    for (var key in source) {
      if (Array.isArray(source[key])) {
        target[key] = source[key];
      } else if (source[key] instanceof Object) {
        if (!target[key]) target[key] = {};
        _mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };
  var records = Array.isArray(resp.data) ? resp.data : [resp.data];
  var newState = _objectSpread({}, state);
  records.forEach(function (record) {
    if (!newState[record.type]) {
      newState[record.type] = {};
    }
    if (!newState[record.type][record.id]) {
      newState[record.type][record.id] = {
        type: record.type,
        id: record.id,
        attributes: {}
      };
    }
    _mergeDeep(newState[record.type][record.id].attributes, record.attributes);
  });
  return newState;
};
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case CLEAR_RECORDS:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, action.record_type, {}));
    case FETCH_RECORDS_SUCCESS:
      return mergeResult(state, action.payload.data);
    case SAVE_RECORD_SUCCESS:
      return mergeResult(state, action.payload.data);
    case DELETE_RECORD:
      var recs = _objectSpread({}, state[action.record.type]);
      delete recs[action.record.id];
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, action.record.type, recs));
    case DELETE_RECORD_FAIL:
      return mergeResult(state, {
        data: action.meta.previousAction.record
      });
    default:
      return state;
  }
}
var queryString = exports.queryString = function queryString(params) {
  return _qs["default"].stringify(params, {
    arrayFormat: 'brackets'
  });
};
function clearRecords(type) {
  return {
    type: CLEAR_RECORDS,
    record_type: type
  };
}
function fetchRecords(type) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: "/".concat(type, "?").concat(queryString(params))
      }
    }
  };
}
function fetchRecord(type, id) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: "/".concat(type, "/").concat(id, "?").concat(queryString(params))
      }
    }
  };
}
function saveRecord(record) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.info('saving record', record, options);
  var method = record.id ? 'PATCH' : 'POST';
  var url = "/".concat(record.type);
  if (record.id) url += "/".concat(record.id);
  return {
    type: SAVE_RECORD,
    ignoreFail: options.ignoreFail,
    payload: {
      request: {
        method: method,
        url: "".concat(url, "?").concat(queryString(options.params || {})),
        data: {
          data: record
        }
      }
    }
  };
}
function deleteRecord(record) {
  return {
    type: DELETE_RECORD,
    record: record,
    payload: {
      request: {
        method: 'DELETE',
        url: "".concat(record.type, "/").concat(record.id)
      }
    }
  };
}