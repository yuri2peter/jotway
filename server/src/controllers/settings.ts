import { Controller, Ctx } from '../types/controller';
import { db } from '../db';
import { settingsSchema } from '@local/common';

const URL_PREFIX = '/api/settings/';

export const settings: Controller = (router) => {
  // 获取系统设置
  router.post(URL_PREFIX + 'get', async (ctx: Ctx) => {
    ctx.body = db.getData().settings;
  });

  // 写入系统设置
  router.post(URL_PREFIX + 'set', async (ctx: Ctx) => {
    const newSettings = settingsSchema.parse(ctx.request.body);
    db.changeData((d) => {
      d.settings = newSettings;
    });
    ctx.body = { ok: 1 };
  });
};
