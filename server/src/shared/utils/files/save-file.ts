import path from 'path';
import { randomUUID } from 'crypto';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import fs from 'fs';
import type { MultipartFile } from '@fastify/multipart';
import type { FastifyInstance } from 'fastify';

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
  'video/mp4': '.mp4',
  'audio/mpeg': '.mp3',
};

function getExt(mime?: string, originalName?: string) {
  if (mime && MIME_EXT[mime]) return MIME_EXT[mime];
  const ext = originalName ? path.extname(originalName) : '';
  return ext || '.bin';
}

function dateFolder(d = new Date()) {
  const yyyy = String(d.getFullYear());
  const dd = String(d.getDate()).padStart(2, '0');   // именно YYYY.DD.MM
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}.${dd}.${mm}`;
}

/**
 * Сохраняет multipart файл в /uploads/YYYY.DD.MM/<uuid>.<ext>
 * Возвращает относительный URL: /static/uploads/YYYY.DD.MM/<uuid>.<ext>
 */
export async function saveMultipartFile(app: FastifyInstance, file: MultipartFile) {
  const folder = dateFolder();
  const dirPath = path.join(app.uploadDir, folder);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const ext = getExt(file.mimetype, file.filename);
  const filename = `${randomUUID()}${ext}`;
  const targetPath = path.join(dirPath, filename);

  await pipeline(file.file, createWriteStream(targetPath));

  const url = `${app.staticPrefix}${folder}/${filename}`; // /static/uploads/YYYY.DD.MM/uuid.ext
  return {
    url,
    filename,           // 'uuid.ext'
    relativePath: `${folder}/${filename}`, // удобно хранить в БД
    mime: file.mimetype,
  };
}