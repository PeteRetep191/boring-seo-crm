
export const groupConversionsByMonth = (dailyStats: any): any => {
    const monthlyData: any = {};
    
    dailyStats.forEach((item: any) => {
        const month = item.day.substring(0, 7);
        
        if (!monthlyData[month]) {
            monthlyData[month] = {
                month: month,
                sales: 0,
                leads: 0,
                totalPayout: 0
            };
        }
        
        monthlyData[month].sales += item.sales;
        monthlyData[month].leads += item.leads;
        monthlyData[month].totalPayout += item.totalPayout;
    });
    
    return Object.values(monthlyData);
}