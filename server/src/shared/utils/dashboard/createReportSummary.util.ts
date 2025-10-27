interface BrocardExpenseItem {
    day: string;
    settled: number;
    pending: number;
    void: number;
    declined: number;
}

export type KeitaroRow = {
    day: string;
    clicks: number;
    leads: number;
    revenue: number;
    sales: number;
}

interface ReportData {
    // brocardExpenses: BrocardExpenseItem[];
    keitaroReport: KeitaroRow[] | any[];
}

interface BrocardSummary {
    settled: number;
    pending: number;
    void: number;
    declined: number;
}

interface KeitaroSummary {
    clicks: number;
    leads: number;
    revenue: number;
    sales: number;
}

interface ReportSummary {
    // brocard: BrocardSummary;
    keitaro: KeitaroSummary;
}

export const createReportSummary = (data: ReportData): ReportSummary => {
    // const brocardSummary = data.brocardExpenses.reduce(
    //     (acc, item) => ({
    //         settled: acc.settled + item.settled,
    //         pending: acc.pending + item.pending,
    //         void: acc.void + item.void,
    //         declined: acc.declined + item.declined
    //     }),
    //     { settled: 0, pending: 0, void: 0, declined: 0 }
    // );

    const keitaroSummary = data.keitaroReport.reduce(
        (acc, item) => ({
            clicks: acc.clicks + item?.clicks,
            leads: acc.leads + item?.leads,
            revenue: acc.revenue + item?.revenue,
            sales: acc.sales + item?.sales
        }),
        { clicks: 0, leads: 0, revenue: 0, sales: 0 }
    );

    return {
        // brocard: brocardSummary,
        keitaro: keitaroSummary
    };
};

export const calculateProfit = (costs: number, revenue: number): number => {
    return revenue - costs;
};