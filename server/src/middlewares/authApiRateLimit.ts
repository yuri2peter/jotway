import Koa from 'koa';
import { startsWith } from '../utils/miscs';
import { RateLimiter } from '../libs/RateLimiter';

const authRateLimiter = new RateLimiter({
  max: 10,
  windowSeconds: 60,
});

export default async function authApiRateLimit(
  ctx: Koa.Context,
  next: Koa.Next
) {
  const { url, ip } = ctx.request;
  if (startsWith(url, ['/api/auth']) && authRateLimiter.do(ip)) {
    ctx.body = { error: `操作过快,请稍后再试` };
    return;
  }
  await next();
}
