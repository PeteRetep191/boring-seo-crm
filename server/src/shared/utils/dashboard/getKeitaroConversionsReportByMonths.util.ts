export const  getKeitaroConversionsReportByMonths = async (apiClients: any, dateStart: Date, dateEnd: Date, users: any[]) => {
    // Генеруємо список місяців
    const months = [];
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    
    while (current <= endMonth) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
        
        // Початок і кінець місяця
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
        
        months.push({
            month: monthStr,
            start: monthStart,
            end: monthEnd
        });
        
        current.setMonth(current.getMonth() + 1);
    }
    
    // Створюємо масив промісів для кожного місяця
    const promises = months.map(({ month, start, end }) => 
        apiClients.keitaro.getConversionsReport(
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0],
            users.length > 0
                ? users.map((user: any) => user.externalId).filter((id: any) => id !== undefined)
                : []
        ).then((result: any) => ({
            month,
            data: result
        }))
    );
    
    // Виконуємо всі запити одночасно
    const results = await Promise.all(promises);
    
    // Агрегуємо результати і перераховуємо totals на основі відфільтрованих dailyStats
    const kaitaroMonthConversionReport = results.map(({ month, data }) => {
        // Фільтруємо dailyStats щоб залишити тільки дні цього місяця
        const filteredDailyStats = data?.dailyStats?.filter((day: any) => 
            day.day.startsWith(month)
        ) || [];
        
        // Перераховуємо totals на основі відфільтрованих даних
        const totalSales = filteredDailyStats.reduce((sum: number, day: any) => sum + (day.sales || 0), 0);
        const totalLeads = filteredDailyStats.reduce((sum: number, day: any) => sum + (day.leads || 0), 0);
        const totalPayout = filteredDailyStats.reduce((sum: number, day: any) => sum + (day.totalPayout || 0), 0);
        
        return {
            month,
            sales: totalSales,
            leads: totalLeads,
            totalPayout: totalPayout,
            dailyStats: filteredDailyStats
        };
    });
    
    return kaitaroMonthConversionReport;
}