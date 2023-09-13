import Koa from 'koa';
import { RateLimiter } from '../libs/RateLimiter';
import { startsWith } from '../utils/miscs';

const checkList = ['/api'];
const excludeList: string[] = [];

// 十分钟内只允许访问1000次
const apiRateLimiter = new RateLimiter({
  max: 1000,
  windowSeconds: 10 * 60,
});

export default async function allApiRateLimit(
  ctx: Koa.Context,
  next: Koa.Next
) {
  const { ip, url } = ctx.request;
  if (startsWith(url, checkList, excludeList) && apiRateLimiter.do(ip)) {
    ctx.status = 429;
    ctx.body = { error: `API访问过快,请稍后再试` };
    return;
  }
  await next();
}
