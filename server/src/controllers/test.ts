import { Controller, Ctx } from '../types/controller';

export const test: Controller = (router) => {
  router.get('/api/test', async (ctx: Ctx) => {
    console.log('Testing');
    ctx.body = { ok: 1 };
  });
};
