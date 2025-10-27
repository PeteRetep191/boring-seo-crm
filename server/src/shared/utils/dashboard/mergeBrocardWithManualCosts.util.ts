export const mergeBrocardWithManualCosts = (
  manualCostsReport: any,
  brocardDailyReport: Array<{
    // очікуємо такі поля з Brocard:
    month: string;        // насправді це day: 'YYYY-MM-DD'
    settled?: string;     // "123.45"
    pending?: string;     // "67.89"
    void?: string;        // на всяк випадок, якщо буде
    commission?: {
      payment: { amount: string; count: number; };
      decline: { amount: string; count: number; };
    }
    count?: number | string;
  }>,
) => {
  // глибока копія вхідного репорту
  const result = JSON.parse(JSON.stringify(manualCostsReport));

  // глобальна сума комісії Brocard (окрема метрика, як і було)
  result.brocardFeeTotal = result.brocardFeeTotal ?? 0;

  // хелпер для 2-х знаків після коми
  const to2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

  // ensure масиви існують
  result.byDate  = Array.isArray(result.byDate)  ? result.byDate  : [];
  result.byType  = Array.isArray(result.byType)  ? result.byType  : [];
  result.byMonth = Array.isArray(result.byMonth) ? result.byMonth : [];

  brocardDailyReport.forEach((r) => {
    const day = r.month; // у відповіді це поле є датою: 'YYYY-MM-DD'
    const settled = Number(r.settled ?? 0);
    const pending = Number(r.pending ?? 0);
    const voided = Number(r.void ?? 0); // на всяк випадок, якщо буде
    const commisionCost = Number(r.commission?.payment?.amount ?? 0) + Number(r.commission?.decline?.amount ?? 0);
    const cnt = Number(r.count ?? 0);

    const rawTotal = to2(settled + pending + commisionCost);

    // комісія 4.5% ТІЛЬКИ для Brocard
    const fee = to2(rawTotal * 0.045);
    const charged = to2(rawTotal + fee);

    const month = day.slice(0, 7); // YYYY-MM

    // ---------------- byDate ----------------
    let dayRecord = result.byDate.find((i: any) => i.day === day);
    if (!dayRecord) {
      dayRecord = {
        day,
        // загальне
        total: 0,
        fee: 0,
        totalWithFee: 0,
        count: 0,
        // media
        mediaTotal: 0,
        mediaFee: 0,
        mediaTotalWithFee: 0,
        mediaCount: 0,
        // technical
        technicalTotal: 0,
        technicalFee: 0,
        technicalTotalWithFee: 0,
        technicalCount: 0,
      };
      result.byDate.push(dayRecord);
    } else {
      // ініціалізація полів, якщо їх не було в manual
      dayRecord.total              = Number(dayRecord.total ?? 0);
      dayRecord.fee                = Number(dayRecord.fee ?? 0);
      dayRecord.totalWithFee       = Number(dayRecord.totalWithFee ?? 0);
      dayRecord.count              = Number(dayRecord.count ?? 0);
      dayRecord.mediaTotal         = Number(dayRecord.mediaTotal ?? 0);
      dayRecord.mediaFee           = Number(dayRecord.mediaFee ?? 0);
      dayRecord.mediaTotalWithFee  = Number(dayRecord.mediaTotalWithFee ?? 0);
      dayRecord.mediaCount         = Number(dayRecord.mediaCount ?? 0);
      dayRecord.technicalTotal     = Number(dayRecord.technicalTotal ?? 0);
      dayRecord.technicalFee       = Number(dayRecord.technicalFee ?? 0);
      dayRecord.technicalTotalWithFee = Number(dayRecord.technicalTotalWithFee ?? 0);
      dayRecord.technicalCount     = Number(dayRecord.technicalCount ?? 0);
    }

    // додаємо лише в "media" (бо Brocard — це media)
    dayRecord.mediaTotal        = to2(dayRecord.mediaTotal + rawTotal);
    dayRecord.mediaFee          = to2(dayRecord.mediaFee + fee);
    dayRecord.mediaTotalWithFee = to2(dayRecord.mediaTotalWithFee + charged);
    dayRecord.mediaCount        = dayRecord.mediaCount + cnt;

    // перераховуємо загальне за день
    dayRecord.total        = to2(dayRecord.mediaTotal + dayRecord.technicalTotal);
    dayRecord.fee          = to2(dayRecord.mediaFee + dayRecord.technicalFee);
    dayRecord.totalWithFee = to2(dayRecord.mediaTotalWithFee + dayRecord.technicalTotalWithFee);
    dayRecord.count        = Number(dayRecord.mediaCount + dayRecord.technicalCount);

    // ---------------- byType (media/technical) ----------------
    let mediaType = result.byType.find((i: any) => i.type === 'media');
    if (!mediaType) {
      mediaType = { type: 'media', total: 0, fee: 0, totalWithFee: 0, count: 0 };
      result.byType.push(mediaType);
    } else {
      mediaType.total        = Number(mediaType.total ?? 0);
      mediaType.fee          = Number(mediaType.fee ?? 0);
      mediaType.totalWithFee = Number(mediaType.totalWithFee ?? 0);
      mediaType.count        = Number(mediaType.count ?? 0);
    }
    mediaType.total        = to2(mediaType.total + rawTotal);
    mediaType.fee          = to2(mediaType.fee + fee);
    mediaType.totalWithFee = to2(mediaType.totalWithFee + charged);
    mediaType.count        = mediaType.count + cnt;

    // ---------------- byMonth ----------------
    let monthRecord = result.byMonth.find((i: any) => i.month === month);
    if (!monthRecord) {
      monthRecord = {
        month,
        // загальне
        total: 0,
        fee: 0,
        totalWithFee: 0,
        count: 0,
        // media
        mediaTotal: 0,
        mediaFee: 0,
        mediaTotalWithFee: 0,
        mediaCount: 0,
        // technical
        technicalTotal: 0,
        technicalFee: 0,
        technicalTotalWithFee: 0,
        technicalCount: 0,
      };
      result.byMonth.push(monthRecord);
    } else {
      monthRecord.total              = Number(monthRecord.total ?? 0);
      monthRecord.fee                = Number(monthRecord.fee ?? 0);
      monthRecord.totalWithFee       = Number(monthRecord.totalWithFee ?? 0);
      monthRecord.count              = Number(monthRecord.count ?? 0);
      monthRecord.mediaTotal         = Number(monthRecord.mediaTotal ?? 0);
      monthRecord.mediaFee           = Number(monthRecord.mediaFee ?? 0);
      monthRecord.mediaTotalWithFee  = Number(monthRecord.mediaTotalWithFee ?? 0);
      monthRecord.mediaCount         = Number(monthRecord.mediaCount ?? 0);
      monthRecord.technicalTotal     = Number(monthRecord.technicalTotal ?? 0);
      monthRecord.technicalFee       = Number(monthRecord.technicalFee ?? 0);
      monthRecord.technicalTotalWithFee = Number(monthRecord.technicalTotalWithFee ?? 0);
      monthRecord.technicalCount     = Number(monthRecord.technicalCount ?? 0);
    }

    monthRecord.mediaTotal        = to2(monthRecord.mediaTotal + rawTotal);
    monthRecord.mediaFee          = to2(monthRecord.mediaFee + fee);
    monthRecord.mediaTotalWithFee = to2(monthRecord.mediaTotalWithFee + charged);
    monthRecord.mediaCount        = monthRecord.mediaCount + cnt;

    monthRecord.total        = to2(monthRecord.mediaTotal + monthRecord.technicalTotal);
    monthRecord.fee          = to2(monthRecord.mediaFee + monthRecord.technicalFee);
    monthRecord.totalWithFee = to2(monthRecord.mediaTotalWithFee + monthRecord.technicalTotalWithFee);
    monthRecord.count        = Number(monthRecord.mediaCount + monthRecord.technicalCount);

    // --------- глобальна сума комісії Brocard (окремо) ----------
    result.brocardFeeTotal = to2(Number(result.brocardFeeTotal) + fee);
  });

  // ---------------- Глобальні тотали перераховуємо з byDate ----------------
  // Якщо manual вже містив fee/withFee — це буде коректний сумарний з урахуванням доданого Brocard
  const sum = (arr: any[], pick: string) =>
    to2(arr.reduce((acc, x) => acc + Number(x?.[pick] ?? 0), 0));

  result.total        = sum(result.byDate, 'total');
  result.fee          = sum(result.byDate, 'fee');
  result.totalWithFee = sum(result.byDate, 'totalWithFee');

  return result;
};