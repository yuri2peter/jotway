import Koa from 'koa';
import { db } from '../db';
import { now } from 'lodash';
import { COOKIE_NAME } from '../configs';
import { startsWith } from '../utils/miscs';

const checkList = ['/api'];
const excludeList = ['/api/auth'];

export default async function loginCheck(ctx: Koa.Context, next: Koa.Next) {
  // 获取当前请求地址
  const { url } = ctx.request;
  const token = ctx.cookies.get(COOKIE_NAME) || '';
  // 需要检查token合法性
  if (
    startsWith(url, checkList, excludeList) &&
    !verifyAdminToken(token.toString())
  ) {
    // token非法
    ctx.status = 401;
    return;
  }
  await next();
}

function verifyAdminToken(token: string) {
  const nowTime = now();
  // 10%的概率执行过期token清理
  if (Math.random() < 0.1) {
    cleanTokens();
  }
  return db.getData().auth.tokens.some((t) => {
    return t.token === token && t.type === 'admin' && t.expiresAt > nowTime;
  });
}

// 删除过期的tokens
function cleanTokens() {
  const nowTime = now();
  db.changeData((d) => {
    d.auth.tokens = d.auth.tokens.filter((t) => {
      return t.expiresAt > nowTime;
    });
  });
}
