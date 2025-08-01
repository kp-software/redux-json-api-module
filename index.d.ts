import { Action } from 'redux';

export type ApiRecord = {
    id: string | number | null;
    type: string;
    attributes: any;
};

export type RecordSet = {
    [key: string]: ApiRecord;
}

export type ApiStore = {
    [key: string]: RecordSet;
}

export type Relationship = {
    data: ApiRecord | Array<ApiRecord>;
};

export const CLEAR_RECORDS: string;
export const FETCH_RECORDS: string;
export const FETCH_RECORDS_SUCCESS: string;
export const SAVE_RECORD: string;
export const SAVE_RECORD_SUCCESS: string;
export const DELETE_RECORD: string;
export const DELETE_RECORD_FAIL: string;
export const clearRecords: (type: string) => void;
export const getRecord: (state: any, { type, id }: { type: string; id: number }) => any;
export const fetchRecords: (type: string, params?: object) => Promise<any>;
export const fetchRecord: (type: string , id: any, params?: object) => Promise<any>;
export const saveRecord: (record: ApiRecord, params?: object) => Promise<any>;
export const deleteRecord: (record: { type: string, id: string | number }) => Promise<any>;
export const getRelationship: (state: any, relationship: any) => any;
export const queryString: (params: any) => string;