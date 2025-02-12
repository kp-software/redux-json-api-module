import { Action } from 'redux';

declare module 'redux-json-api-module' {
    export type ApiRecord = {
        id?: string | number;
        type: string;
        attributes: any;
    };

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
    export const fetchRecords: (type: string, params?: object) => Action;
    export const fetchRecord: (type: string , id: any, params?: object) => Action;
    export const saveRecord: (record: ApiRecord, params?: object) => Action;
    export const deleteRecord: (record: ApiRecord) => Action;
    export const getRelationship: (state: any, relationship: any) => any;
    export const queryString: (params: any) => string;
}