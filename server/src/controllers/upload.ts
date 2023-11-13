import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';
import { Controller, Ctx } from '../types/controller';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { htmlResourcesUploadsPath } from '../configs';

export const upload: Controller = (router) => {
  // 多文件上传
  router.post('/api/upload-multi', async (ctx: Ctx) => {
    const files = ctx.request.files['file[]'];
    if (!files) {
      ctx.body = [];
      return;
    }
    const files1: Array<any> = Array.isArray(files) ? files : [files];
    ctx.body = files1.map((file) => {
      const { newFilename, originalFilename, mimetype, size } = file;
      return {
        newFilename,
        originalFilename,
        mimetype,
        size,
        url: '/uploads/' + newFilename,
      };
    });
  });

  // 该API被多处使用，变更需谨慎
  router.post('/api/upload', async (ctx: Ctx) => {
    const file = ctx.request.files.file;
    const { mimetype, newFilename, originalFilename, size } = file;
    ctx.body = {
      mimetype,
      newFilename,
      originalFilename,
      size,
      url: '/uploads/' + newFilename,
    };
  });

  // 给定一个src，服务端下载图片至本地，并返回url
  router.post('/api/upload-image-src', async (ctx: Ctx) => {
    const { url: originalURL } = z
      .object({ url: z.string() })
      .parse(ctx.request.body);
    const { data } = await axios.get(originalURL, { responseType: 'stream' });
    const fileName =
      'image.' + nanoid() + '.' + originalURL.split('?')[0].split('/').pop();
    const writer = fs.createWriteStream(
      path.join(htmlResourcesUploadsPath, fileName)
    );
    await data.pipe(writer);
    ctx.body = {
      msg: '',
      code: 0,
      data: {
        originalURL,
        url: '/uploads/' + fileName,
      },
    };
  });
};
