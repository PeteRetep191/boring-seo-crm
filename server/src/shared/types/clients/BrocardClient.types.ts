export interface BrocardUser {
    id: number;
    name: string;
    email: string;
}

export interface BrocardUsersResponse {
    data: BrocardUser[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface BrocardExpenseAmount {
    amount: string;
    count: number;
}

export interface BrocardExpenseCommission {
    payment: BrocardExpenseAmount;
    decline: BrocardExpenseAmount;
}

export interface BrocardGroupedExpenseItem {
    group: {
        type: string;
        entity: {
            short: string;
            begin: string;
            end: string;
        };
    };
    settled: BrocardExpenseAmount;
    pending: BrocardExpenseAmount;
    void: BrocardExpenseAmount;
    declined: BrocardExpenseAmount;
    commission: BrocardExpenseCommission;
    decline_rate: number;
    amount: string;
    count: number;
}

export interface BrocardGroupedExpensesResponse {
    data: BrocardGroupedExpenseItem[];
    summary: BrocardGroupedExpenseItem;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}