import { z } from 'zod';
import { Controller, Ctx } from '../types/controller';
import { linkerSchema } from '@local/common';
import { db } from '../db';
import { now } from 'lodash';

const URL_PREFIX = '/api/linker/';

export const linker: Controller = (router) => {
  // 创建/修改
  router.post(URL_PREFIX + 'upsert', async (ctx: Ctx) => {
    const linkerEntity = linkerSchema.parse(ctx.request.body);
    db.changeData((d) => {
      const prev = d.linkers.find((l) => l.id === linkerEntity.id);
      if (prev) {
        Object.assign(prev, linkerEntity);
      } else {
        d.linkers.push(linkerEntity);
      }
    });
    ctx.body = { ok: 1 };
  });

  // 删除单个
  router.post(URL_PREFIX + 'delete', async (ctx: Ctx) => {
    const { id } = z.object({ id: z.string() }).parse(ctx.request.body);
    db.changeData((d) => {
      d.linkers = d.linkers.filter((l) => l.id !== id);
    });
    ctx.body = { ok: 1 };
  });

  // 获取单个
  router.post(URL_PREFIX + 'get', async (ctx: Ctx) => {
    const { id } = z.object({ id: z.string() }).parse(ctx.request.body);
    const linker = db.getData().linkers.find((t) => t.id === id) || null;
    ctx.body = { linker };
  });

  // 获取所有，传入updatedAt作为参照，如果updatedAt一致，省略内容，节约流量
  router.post(URL_PREFIX + 'list', async (ctx: Ctx) => {
    const bodySchema = z.array(z.tuple([z.string(), z.number()])); // [ ['id', 16810315486], [...], ... ]
    const request = bodySchema.parse(ctx.request.body);
    const linkers = db.getData().linkers.map((t) => {
      if (
        request.some(
          ([id, updatedAt]) => id === t.id && updatedAt === t.updatedAt
        )
      ) {
        return t.id;
      } else {
        return t;
      }
    });
    ctx.body = linkers;
  });

  // 更新content
  router.post(URL_PREFIX + 'update-content', async (ctx: Ctx) => {
    const { id, content } = z
      .object({ id: z.string(), content: z.string() })
      .parse(ctx.request.body);
    db.changeData((d) => {
      const prev = d.linkers.find((l) => l.id === id);
      if (prev) {
        Object.assign(prev, { content, updatedAt: now() });
      }
    });
    ctx.body = { ok: 1 };
  });

  // 记录一次访问计数
  router.post(URL_PREFIX + 'access-count', async (ctx: Ctx) => {
    const { id } = z.object({ id: z.string() }).parse(ctx.request.body);
    db.changeData((d) => {
      const prev = d.linkers.find((l) => l.id === id);
      if (prev) {
        Object.assign(prev, { updatedAt: now() });
        prev.accessCount += 1;
        prev.accessAt = now();
      }
    });
    ctx.body = { ok: 1 };
  });

  // trans-to-article 转换为文章
  router.post(URL_PREFIX + 'trans-to-article', async (ctx: Ctx) => {
    const { id } = z.object({ id: z.string() }).parse(ctx.request.body);
    db.changeData((d) => {
      const prev = d.linkers.find((l) => l.id === id);
      if (prev) {
        Object.assign(prev, { updatedAt: now() });
        const { name, desc, url } = prev;
        prev.content = `# ${name}\n\n[${url}](${url})\n\n${desc}`;
        prev.article = true;
      }
    });
    ctx.body = { ok: 1 };
  });
};
