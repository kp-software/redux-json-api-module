"use strict";
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
const qs_1 = __importDefault(require("qs"));
const normalize_1 = __importDefault(require("./normalize"));
const deepmerge_1 = __importDefault(require("deepmerge"));
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
const INITIAL_STATE = {
    loading: false,
};
const arrayMerge = (a, b) => b;
const resultMerge = (state, resp) => {
    if (!resp.data)
        return state;
    const newState = Object.assign({}, state);
    const normalizedResp = (0, normalize_1.default)(resp);
    return (0, deepmerge_1.default)(newState, normalizedResp, { arrayMerge });
};
function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case exports.CLEAR_RECORDS:
            return Object.assign(Object.assign({}, state), { [action.record_type]: {} });
        case exports.FETCH_RECORDS_SUCCESS:
            return Object.assign(resultMerge(state, action.payload.data), { loading: false });
        case exports.SAVE_RECORD_SUCCESS:
            return Object.assign(resultMerge(state, action.payload.data), { loading: false });
        case exports.DELETE_RECORD:
            const recs = Object.assign({}, state[action.record.type]);
            delete recs[action.record.id];
            return Object.assign(Object.assign({}, state), { [action.record.type]: recs });
        case exports.DELETE_RECORD_FAIL:
            return Object.assign(resultMerge(state, { data: action.meta.previousAction.record }), { loading: false });
        default:
            return state;
    }
}
const queryString = (params) => qs_1.default.stringify(params, { arrayFormat: 'brackets' });
exports.queryString = queryString;
function clearRecords(type) {
    return {
        type: exports.CLEAR_RECORDS,
        record_type: type,
    };
}
function fetchRecords(type, params = {}) {
    return {
        type: exports.FETCH_RECORDS,
        payload: {
            request: {
                method: 'GET',
                url: `/${type}?${(0, exports.queryString)(params)}`,
            },
        },
    };
}
function fetchRecord(type, id, params = {}) {
    return {
        type: exports.FETCH_RECORDS,
        payload: {
            request: {
                method: 'GET',
                url: `/${type}/${id}?${(0, exports.queryString)(params)}`,
            },
        },
    };
}
function saveRecord(record, options = {}) {
    console.info('saving record', record, options);
    const method = record.id ? 'PATCH' : 'POST';
    let url = `/${record.type}`;
    if (record.id)
        url += `/${record.id}`;
    return {
        type: exports.SAVE_RECORD,
        ignoreFail: options.ignoreFail,
        payload: {
            request: {
                method,
                url: `${url}?${(0, exports.queryString)(options.params || {})}`,
                data: { data: record },
            },
        },
    };
}
function deleteRecord(record) {
    return {
        type: exports.DELETE_RECORD,
        record,
        payload: {
            request: {
                method: 'DELETE',
                url: `${record.type}/${record.id}`,
            },
        },
    };
}
