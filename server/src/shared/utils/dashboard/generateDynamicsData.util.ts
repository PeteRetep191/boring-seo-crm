export const generateDynamicsData = (
  dateStart: any,
  dateEnd: any,
  costsMonthlyReport: any,
  brocardMonthlyReport: any,
  kaitaroMonthConversionReport: any
) => {
  // Генеруємо список місяців
  const months = [];
  const start = new Date(dateStart);
  const end = new Date(dateEnd);

  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= endMonth) {
    const monthStr = `${current.getFullYear()}-${String(
      current.getMonth() + 1
    ).padStart(2, "0")}`;
    months.push(monthStr);
    current.setMonth(current.getMonth() + 1);
  }

  // Об'єднуємо costsMonthlyReport з brocardMonthlyReport
  const mergedCosts = JSON.parse(JSON.stringify(costsMonthlyReport));

  brocardMonthlyReport.forEach((brocardRecord: any) => {
    let costRecord = mergedCosts.find(
      (item: any) => item.month === brocardRecord.month
    );

    if (!costRecord) {
      costRecord = {
        month: brocardRecord.month,
        total: 0,
        mediaTotal: 0,
        mediaCount: 0,
        technicalTotal: 0,
        technicalCount: 0,
        count: 0,
      };
      mergedCosts.push(costRecord);
    }

    costRecord.mediaTotal += brocardRecord.total;
    costRecord.mediaCount += brocardRecord.count;
    costRecord.total = costRecord.mediaTotal + costRecord.technicalTotal;
  });

  // Генеруємо динаміку для кожного місяця
  const result: any = {
    tech_costs_dynamics: [],
    total_costs_dynamics: [],
    profit_dynamics: [],
    roi_dynamics: [],
  };

  months.forEach((month: any) => {
    // === ось тут перевірка, якщо місяць < 2025-04 — все в 0 ===
    if (month < "2025-05") {
      result.tech_costs_dynamics.push({ month, value: 0 });
      result.total_costs_dynamics.push({ month, value: 0 });
      result.profit_dynamics.push({ month, value: 0 });
      result.roi_dynamics.push({ month, value: 0 });
      return;
    }

    const costData = mergedCosts.find((item: any) => item.month === month);
    const revenueData = kaitaroMonthConversionReport.find(
      (item: any) => item.month === month
    );

    const techCosts = Math.round((costData?.technicalTotal || 0) * 100) / 100;
    const totalCosts = Math.round((costData?.total || 0) * 100) / 100;
    const revenue = Math.round((revenueData?.totalPayout || 0) * 100) / 100;
    const profit = Math.round((revenue - totalCosts) * 100) / 100;
    const roi =
      totalCosts > 0
        ? Math.round(((profit / totalCosts) * 100) * 100) / 100
        : 0;

    result.tech_costs_dynamics.push({ month, value: techCosts });
    result.total_costs_dynamics.push({ month, value: totalCosts });
    result.profit_dynamics.push({ month, value: profit });
    result.roi_dynamics.push({ month, value: roi });
  });

  return result;
};