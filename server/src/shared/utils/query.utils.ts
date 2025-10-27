import { Types } from 'mongoose';
/**
 * Build MongoDB query based on array of filters
 * @param filters - array of filters in format { key: string, operator: string, value: any }
 * @returns MongoDB query object for use in $match or find()
 * @example
 * buildFiltersQuery([
 *   { key: 'amount', operator: 'gte', value: 100 },
 *   { key: 'status', operator: 'in', value: ['active', 'pending'] }
 * ])
 * // returns: { amount: { $gte: 100 }, status: { $in: ['active', 'pending'] } }
 */
export const buildFiltersQuery = (filters?: Array<{ key: string, operator: string, value: any }>) => {
    if (!filters?.length) return {};
    
    const query: any = {};
    
    filters.forEach(filter => {
        const { key, operator, value } = filter;

        let processedValue = value;
        if (['createdBy', 'userId', '_id'].includes(key)) {
            if (Array.isArray(value)) {
                processedValue = value.map(v => new Types.ObjectId(v));
            } else {
                processedValue = new Types.ObjectId(value);
            }
        }

        // Конвертувати дату
        if (key === 'date' && typeof value === 'string') {
            processedValue = new Date(value);
            if (operator === 'lte') {
                processedValue.setHours(23, 59, 59, 999);
            }
            if (operator === 'gte') {
                processedValue.setHours(0, 0, 0, 0);
            }
        }
        
        if (operator === 'eq') {
            query[key] = processedValue;
        } else {
            // Створити об'єкт якщо не існує або це не об'єкт
            if (!query[key] || typeof query[key] !== 'object' || Array.isArray(query[key])) {
                query[key] = {};
            }
            
            // Додати оператор
            const mongoOperator = `$${operator}`;
            query[key][mongoOperator] = processedValue;
        }
    });
    
    return query;
}
