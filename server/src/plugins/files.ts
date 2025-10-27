import fp from 'fastify-plugin';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';

declare module 'fastify' {
  interface FastifyInstance {
    uploadDir: string;
    staticPrefix: string;
  }
}

export default fp(async (app) => {
  const rawUploadDir =
    process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

  const uploadDir = path.isAbsolute(rawUploadDir)
    ? rawUploadDir
    : path.resolve(process.cwd(), rawUploadDir);

  const staticPrefix = '/static/uploads/';

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE || 20 * 1024 * 1024),
      files: 1,
    },
  });

  await app.register(fastifyStatic, {
    root: uploadDir,
    prefix: staticPrefix,      // => /static/uploads/<RELATIVE_PATH>
    cacheControl: false,
  });

  // (опц.) алиас под «короткий» путь /uploads/* — удобно при миграции/для теста:
  await app.register(fastifyStatic, {
    root: uploadDir,
    prefix: '/uploads/',
    decorateReply: false,      // чтобы не перетирать декорации предыдущего инстанса
    cacheControl: false,
  });

  app.decorate('uploadDir', uploadDir);
  app.decorate('staticPrefix', staticPrefix);

  // Диагностика: увидеть смонтированные пути и где лежит uploadDir
  app.ready((err) => {
    if (err) app.log.error(err);
    app.log.info({ uploadDir, staticPrefix }, 'files-plugin: ready');
    app.printRoutes(); // в логах увидишь /static/uploads/* и /uploads/*
  });
});