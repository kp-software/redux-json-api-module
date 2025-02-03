declare module 'redux-json-api-module' {
    export type ApiRecord = {
        id: number;
        type: string;
        attributes: any;
    }

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
    export const deleteRecord: (record: ApiRecord) => Promise<any>;
    export const getRelationship: (state: any, relationship: any) => any;
    export const queryString: (params: any) => string;
}
