import fetchBingWallpaper from 'bing-wallpaper-daily';
import { parseByString } from 'bookmark-file-parser';
import { z } from 'zod';
import { fetchHtml } from '../libs/fetchHtml';
import { Controller, Ctx } from '../types/controller';
import { bookmarksSchema } from '@local/common';

const URL_PREFIX = '/api/utils/';

export const utils: Controller = (router) => {
  // fetch url
  router.post(URL_PREFIX + 'fetch-url', async (ctx: Ctx) => {
    const { url } = z.object({ url: z.string() }).parse(ctx.request.body);
    ctx.body = await fetchHtml(url);
  });

  // 获取bing壁纸
  router.post(URL_PREFIX + 'bing-wallpaper', async (ctx: Ctx) => {
    const data = await fetchBingWallpaper({
      market: 'zh-CN',
      count: 1,
      format: 'js',
      idx: 0,
      n: 1,
    });
    ctx.body = z.object({ url: z.string(), title: z.string() }).parse(data[0]);
  });

  // 解析书签数据
  router.post(URL_PREFIX + 'parse-bookmarks', async (ctx: Ctx) => {
    const { text } = z.object({ text: z.string() }).parse(ctx.request.body);
    const data = parseByString(text);
    ctx.body = bookmarksSchema.parse(data);
  });
};
