declare module 'json-api-normalizer' {
    interface Options {
        camelizeKeys?: boolean;
        camelizeTypeValues?: boolean;
        endpoint?: string;
    }

    interface NormalizedData {
        [key: string]: any;
    }

    function normalize(
        data: any,
        options?: Options
    ): NormalizedData;

    export = normalize;
}