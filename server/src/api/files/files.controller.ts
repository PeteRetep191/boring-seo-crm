import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse, ErrorUtils } from '@/shared/utils';
import { saveMultipartFile } from '@/shared/utils/files/save-file';

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const file = await (request as any).file(); // @fastify/multipart
    if (!file) return ApiResponse.error(reply, 'No file provided', 400);

    // (опционально) whitelist MIME:
    const ALLOWED = (process.env.ALLOWED_MIME || '').split(',').map(s => s.trim()).filter(Boolean);
    if (ALLOWED.length && !ALLOWED.includes(file.mimetype)) {
      return ApiResponse.error(reply, 'File type is not allowed', 415);
    }

    const saved = await saveMultipartFile(reply.server, file);
    return ApiResponse.success(reply, {
      url: saved.url,               // <-- относительная ссылка на статику
      path: saved.relativePath,     // 'YYYY.DD.MM/uuid.ext'
      mime: saved.mime,
    });
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}