interface BrocardItem {
    group: {
        entity: {
            short: string;
        };
    };
    settled: {
        amount: string;
    };
    pending: {
        amount: string;
    };
    void: {
        amount: string;
    };
    declined: {
        amount: string;
    };
}

interface ConvertedItem {
    day: string;
    settled: number;
    pending: number;
    void: number;
    declined: number;
}

export const convertBrocardReport = (data: BrocardItem[]): ConvertedItem[] => {
    return data.map(item => ({
        day: item.group.entity.short,
        settled: parseFloat(item.settled.amount),
        pending: parseFloat(item.pending.amount),
        void: parseFloat(item.void.amount),
        declined: parseFloat(item.declined.amount)
    }));
}