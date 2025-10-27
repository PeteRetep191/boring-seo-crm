export type KeitaroReportParams = {
    dateFrom: string; // YYYY-MM-DD
    dateTo: string;   // YYYY-MM-DD
    dimensions: string[];
    measures: string[];
    filters?: Array<{
        name: string;
        operator: string;
        expression?: (string[] | number[] | string | number);
    }>;
    sort?: Array<{
        name: string;
        order: 'ASC' | 'DESC';
    }>;
    timezone?: string;
}

export type KeitaroReportResponse = {
    rows: any[][];
    meta: {
        columns: string[];
    };
    total?: number;
}