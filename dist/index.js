"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryString = exports.DELETE_RECORD_FAIL = exports.DELETE_RECORD = exports.SAVE_RECORD_SUCCESS = exports.SAVE_RECORD = exports.FETCH_RECORDS_SUCCESS = exports.FETCH_RECORDS = exports.CLEAR_RECORDS = exports.getRelationship = exports.getRecord = void 0;
exports.default = reducer;
exports.clearRecords = clearRecords;
exports.fetchRecords = fetchRecords;
exports.fetchRecord = fetchRecord;
exports.saveRecord = saveRecord;
exports.deleteRecord = deleteRecord;
var qs_1 = __importDefault(require("qs"));
var json_api_normalizer_1 = __importDefault(require("json-api-normalizer"));
var deepmerge_1 = __importDefault(require("deepmerge"));
var selectors_1 = require("./selectors");
Object.defineProperty(exports, "getRecord", { enumerable: true, get: function () { return selectors_1.getRecord; } });
Object.defineProperty(exports, "getRelationship", { enumerable: true, get: function () { return selectors_1.getRelationship; } });
exports.CLEAR_RECORDS = 'redux-json-api-module/api/CLEAR_RECORDS';
exports.FETCH_RECORDS = 'redux-json-api-module/api/FETCH_RECORDS';
exports.FETCH_RECORDS_SUCCESS = 'redux-json-api-module/api/FETCH_RECORDS_SUCCESS';
exports.SAVE_RECORD = 'redux-json-api-module/api/SAVE_RECORD';
exports.SAVE_RECORD_SUCCESS = 'redux-json-api-module/api/SAVE_RECORD_SUCCESS';
exports.DELETE_RECORD = 'redux-json-api-module/api/DELETE_RECORD';
exports.DELETE_RECORD_FAIL = 'redux-json-api-module/api/DELETE_RECORD_FAIL';
var INITIAL_STATE = {
    loading: false,
};
var arrayMerge = function (a, b) { return b; };
var resultMerge = function (state, resp) {
    if (!resp.data)
        return state;
    var newState = __assign({}, state);
    var normalizedResp = (0, json_api_normalizer_1.default)(resp, { camelizeKeys: false, camelizeTypeValues: false });
    return (0, deepmerge_1.default)(newState, normalizedResp, { arrayMerge: arrayMerge });
};
function reducer(state, action) {
    var _a, _b;
    if (state === void 0) { state = INITIAL_STATE; }
    switch (action.type) {
        case exports.CLEAR_RECORDS:
            return __assign(__assign({}, state), (_a = {}, _a[action.record_type] = {}, _a));
        case exports.FETCH_RECORDS_SUCCESS:
            return Object.assign(resultMerge(state, action.payload.data), { loading: false });
        case exports.SAVE_RECORD_SUCCESS:
            return Object.assign(resultMerge(state, action.payload.data), { loading: false });
        case exports.DELETE_RECORD:
            var recs = __assign({}, state[action.record.type]);
            delete recs[action.record.id];
            return __assign(__assign({}, state), (_b = {}, _b[action.record.type] = recs, _b));
        case exports.DELETE_RECORD_FAIL:
            return Object.assign(resultMerge(state, { data: action.meta.previousAction.record }), { loading: false });
        default:
            return state;
    }
}
var queryString = function (params) { return qs_1.default.stringify(params, { arrayFormat: 'brackets' }); };
exports.queryString = queryString;
function clearRecords(type) {
    return {
        type: exports.CLEAR_RECORDS,
        record_type: type,
    };
}
function fetchRecords(type, params) {
    if (params === void 0) { params = {}; }
    return {
        type: exports.FETCH_RECORDS,
        payload: {
            request: {
                method: 'GET',
                url: "/".concat(type, "?").concat((0, exports.queryString)(params)),
            },
        },
    };
}
function fetchRecord(type, id, params) {
    if (params === void 0) { params = {}; }
    return {
        type: exports.FETCH_RECORDS,
        payload: {
            request: {
                method: 'GET',
                url: "/".concat(type, "/").concat(id, "?").concat((0, exports.queryString)(params)),
            },
        },
    };
}
function saveRecord(record, options) {
    if (options === void 0) { options = {}; }
    console.info('saving record', record, options);
    var method = record.id ? 'PATCH' : 'POST';
    var url = "/".concat(record.type);
    if (record.id)
        url += "/".concat(record.id);
    return {
        type: exports.SAVE_RECORD,
        ignoreFail: options.ignoreFail,
        payload: {
            request: {
                method: method,
                url: "".concat(url, "?").concat((0, exports.queryString)(options.params || {})),
                data: { data: record },
            },
        },
    };
}
function deleteRecord(record) {
    return {
        type: exports.DELETE_RECORD,
        record: record,
        payload: {
            request: {
                method: 'DELETE',
                url: "".concat(record.type, "/").concat(record.id),
            },
        },
    };
}
