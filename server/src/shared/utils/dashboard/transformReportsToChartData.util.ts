export const transformReportsToChartData = (
  startDate: string, 
  endDate: string, 
  revenueKey: string,
  sortField?: string,
  sortOrder: 'asc' | 'desc' = 'asc',
  ...args: Array<{ prefix?: string; data: any[] } | Record<string, (dayData: any) => number>>
) => {

  // console.dir(args, { depth: null, colors: true });
  let calculatedFields: Record<string, (dayData: any) => number> = {};
  let dataWithPrefixes: Array<{ prefix?: string; data: any[] }> = [];

  args.forEach(arg => {
    if ('data' in arg || 'prefix' in arg) {
      dataWithPrefixes.push(arg as { prefix?: string; data: any[] });
    } else {
      calculatedFields = { ...calculatedFields, ...(arg as Record<string, (dayData: any) => number>) };
    }
  });

  // Генеруємо список всіх днів в діапазоні
  const dateRange = generateDateRange(startDate, endDate);
  
  // Створюємо базову структуру з нулями для всіх днів
  const chartData: any[] = dateRange.map(date => ({ date }));
  
  // Обробляємо кожну групу даних з префіксом
  dataWithPrefixes.forEach(({ prefix, data }) => {
    const keys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'day') {
          keys.add(key);
        }
      });
    });
    
    chartData.forEach(dayData => {
      keys.forEach(key => {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        dayData[fieldName] = 0;
      });
    });
    
    chartData.forEach(dayData => {
      Object.keys(dayData).forEach(k => {
        if (typeof dayData[k] === 'number') {
          dayData[k] = round2(dayData[k]);
        }
      });
    });
    
    data.forEach(item => {
      const day = item.day;
      const dayIndex = chartData.findIndex(d => d.date === day);
      
      if (dayIndex !== -1) {
        Object.keys(item).forEach(key => {
          if (key !== 'day' && typeof item[key] === 'number') {
            const fieldName = prefix ? `${prefix}.${key}` : key;
            chartData[dayIndex][fieldName] = add2(chartData[dayIndex][fieldName], item[key]);
          }
        });
      }
    });
  });
  
  // Розраховуємо додаткові поля після агрегації базових даних
  chartData.forEach(dayData => {
    Object.entries(calculatedFields).forEach(([fieldName, calculateFn]) => {
      try {
        dayData[fieldName] = calculateFn(dayData);
      } catch (error) {
        // console.warn(`Error calculating ${fieldName}:`, error);
        dayData[fieldName] = 0;
      }
    });
  });
  
  // Сортування якщо задано поле для сортування
  if (sortField) {
    chartData.sort((a, b) => {
      let aValue = a[sortField] || 0;
      let bValue = b[sortField] || 0;
      
      // Якщо сортуємо по даті - конвертуємо в Date для правильного порівняння
      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });
  }
  
  // Знаходимо день з найбільшим revenue
  const topResult = chartData.length > 0 
    ? chartData.reduce((max, current) => {
        const currentRevenue = current[revenueKey] || 0;
        const maxRevenue = max[revenueKey] || 0;
        return currentRevenue > maxRevenue ? current : max;
      })
    : { date: startDate, [revenueKey]: 0 };

  return {
    topResult: {
      date: topResult.date,
      revenue: parseFloat((topResult[revenueKey] || 0).toFixed(2))
    },
    data: chartData
  };
};

const generateDateRange = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// округление до 2 знаков c учётом EPSILON
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

// безопасное сложение с промежуточным округлением
const add2 = (a: number, b: number) => round2((a || 0) + (b || 0));