// 系统关键API
import { Controller, Ctx } from '../types/controller';
import fs from 'fs-extra';
import { db } from '../db';
import { defaultData } from '@local/common';
import { log } from '../libs/logger';
import { htmlResourcesUploadsPath } from '../configs';

const URL_PREFIX = '/api/system/';

export const system: Controller = (router) => {
  // 导入数据
  router.post(URL_PREFIX + 'import-data', async (ctx: Ctx) => {
    const record = ctx.request.body;
    db.importRecord(record);
    ctx.body = { ok: 1 };
    log('Data Imported.');
  });

  // 导出数据
  router.post(URL_PREFIX + 'export-data', async (ctx: Ctx) => {
    ctx.body = db.exportRecord();
    log('Data Exported.');
  });

  // 数据重置
  router.post(URL_PREFIX + 'reset-data', async (ctx: Ctx) => {
    db.setData(defaultData);
    ctx.body = { ok: 1 };
    log('Data Reset.');
  });

  // 清理上传文件
  router.post(URL_PREFIX + 'clear-uploads', async (ctx: Ctx) => {
    const cleanResults: string[] = [];
    const dataStr = JSON.stringify(db.getData());
    // 遍历上传目录
    fs.readdirSync(htmlResourcesUploadsPath).forEach((file) => {
      if (!dataStr.includes(file)) {
        fs.unlinkSync(`${htmlResourcesUploadsPath}/${file}`);
        cleanResults.push(file);
      }
    });
    ctx.body = {
      ok: 1,
      cleanResults,
    };
  });
};
