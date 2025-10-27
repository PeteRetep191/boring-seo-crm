// Types
import type { FastifyRequest } from 'fastify/types/request';
// Utils
import { UAParser } from 'ua-parser-js';

// ============================
// Get Client Info
// ============================
const getClientInfo = (request: FastifyRequest): ClientInfo => {
    const headers = request.headers;
    const uaString = String(headers['user-agent'] || '');
    const parser = new UAParser(uaString);
    const uaResult = parser.getResult();

    return {
        ip: request.ip,
        userAgent: uaString,
        os: uaResult.os.name || null,
        device: {
            model: uaResult.device.model || 'Unknown',
            vendor: uaResult.device.vendor || 'Unknown'
        },
        browser: {
            name: uaResult.browser.name || null,
            version: uaResult.browser.version || null
        }
    };
}

export default getClientInfo;

// ===========================
// Types
// ===========================
export type ClientInfo = {
    ip: string;
    userAgent: string;
    os: string | null;
    device: {
        model: string | null;
        vendor: string | null;
    };
    browser: {
        name: string | null;
        version: string | null;
    };
}