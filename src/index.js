import qs from 'qs';
import normalize from 'json-api-normalizer';

export * from './selectors';

export const CLEAR_RECORDS = 'redux-json-api-module/api/CLEAR_RECORDS';
export const FETCH_RECORDS = 'redux-json-api-module/api/FETCH_RECORDS';
export const FETCH_RECORDS_SUCCESS = 'redux-json-api-module/api/FETCH_RECORDS_SUCCESS';
export const SAVE_RECORD = 'redux-json-api-module/api/SAVE_RECORD';
export const SAVE_RECORD_SUCCESS = 'redux-json-api-module/api/SAVE_RECORD_SUCCESS';
export const DELETE_RECORD = 'redux-json-api-module/api/DELETE_RECORD';
export const DELETE_RECORD_FAIL = 'redux-json-api-module/api/DELETE_RECORD_FAIL';

const INITIAL_STATE = {
  loading: false,
};

const mergeResult = (state, resp) => {
  if (!resp.data) return state;

  const normalizedData = normalize(resp, { camelizeKeys: false, camelizeTypeValues: false });

  const mergeDeep = (target, source) => {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) target[key] = {};
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  const newState = { ...state };

  Object.keys(normalizedData).forEach(recordType => {
    if (!newState[recordType]) {
      newState[recordType] = {};
    }
    Object.keys(normalizedData[recordType]).forEach(recordId => {
      if (!newState[recordType][recordId]) {
        newState[recordType][recordId] = {};
      }
      mergeDeep(newState[recordType][recordId], normalizedData[recordType][recordId]);
    });
  });

  return newState;
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CLEAR_RECORDS:
      return { ...state, [action.record_type]: {} };

    case FETCH_RECORDS_SUCCESS:
      return mergeResult(state, action.payload.data);

    case SAVE_RECORD_SUCCESS:
      return mergeResult(state, action.payload.data);

    case DELETE_RECORD:
      const recs = { ...state[action.record.type] };
      delete recs[action.record.id];

      return { ...state, [action.record.type]: recs };

    case DELETE_RECORD_FAIL:
      return mergeResult(state, { data: action.meta.previousAction.record });

    default:
      return state;
  }
}

export const queryString = params => qs.stringify(params, { arrayFormat: 'brackets' });

export function clearRecords(type) {
  return {
    type: CLEAR_RECORDS,
    record_type: type,
  };
}

export function fetchRecords(type, params = {}) {
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: `/${type}?${queryString(params)}`,
      },
    },
  };
}

export function fetchRecord(type, id, params = {}) {
  return {
    type: FETCH_RECORDS,
    payload: {
      request: {
        method: 'GET',
        url: `/${type}/${id}?${queryString(params)}`,
      },
    },
  };
}

export function saveRecord(record, options = {}) {
  console.info('saving record', record, options);

  const method = record.id ? 'PATCH' : 'POST';
  let url = `/${record.type}`;

  if (record.id) url += `/${record.id}`;

  return {
    type: SAVE_RECORD,
    ignoreFail: options.ignoreFail,
    payload: {
      request: {
        method,
        url: `${url}?${queryString(options.params || {})}`,
        data: { data: record },
      },
    },
  };
}

export function deleteRecord(record) {
  return {
    type: DELETE_RECORD,
    record,
    payload: {
      request: {
        method: 'DELETE',
        url: `${record.type}/${record.id}`,
      },
    },
  };
}
