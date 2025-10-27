interface ExpenseItem {
    settled: { amount: string; count: number };
    pending: { amount: string; count: number };
    void: { amount: string; count: number };
    declined: { amount: string; count: number };
}

interface ExpenseSummary {
    settled: number;
    pending: number;
    void: number;
    declined: number;
    total: number;
}

export function calculateExpenseTotals(expenses: ExpenseItem[]): ExpenseSummary {
    const totals = expenses.reduce(
        (acc, expense) => ({
            settled: acc.settled + parseFloat(expense.settled.amount),
            pending: acc.pending + parseFloat(expense.pending.amount),
            void: acc.void + parseFloat(expense.void.amount),
            declined: acc.declined + parseFloat(expense.declined.amount)
        }),
        { settled: 0, pending: 0, void: 0, declined: 0 }
    );

    return {
        ...totals,
        total: totals.settled + totals.pending + totals.void + totals.declined
    };
}