import { Controller, Ctx } from '../types/controller';
import { db } from '../db';
import { getGlobalData } from '../libs/globalData';
import { getRandomString } from '../utils/miscs';
import { z } from 'zod';
import { now } from 'lodash';
import { defaultPassword } from '@local/common';
import { COOKIE_NAME } from '../configs';
import { lang } from '../libs/lang';

const URL_PREFIX = '/api/auth/';
const TOKEN_MAX_AGE = 7 * 24 * 3600 * 1000; // TOKEN过期时间为7天

export const auth: Controller = (router) => {
  // 返回是否是默认密码
  router.post(URL_PREFIX + 'is-default-password', async (ctx: Ctx) => {
    ctx.body = { isDefaultPassword: isDefaultPassword() };
  });

  // 刷新密码重置code
  router.post(URL_PREFIX + 'apply-reset-code', async (ctx: Ctx) => {
    const code = getRandomString(8);
    getGlobalData().resetPasswordCode = code;
    console.log(
      `\n\n[${new Date().toLocaleTimeString()}] CODE = "${code}"\n\n`
    );
    ctx.body = { isDefaultPassword: false };
  });

  // 验证密码重置code
  router.post(URL_PREFIX + 'verify-reset-code', async (ctx: Ctx) => {
    const { code } = z.object({ code: z.string() }).parse(ctx.request.body);
    ctx.body = { verified: code === getGlobalData().resetPasswordCode };
  });

  // 验证并重置密码
  router.post(URL_PREFIX + 'reset-password', async (ctx: Ctx) => {
    const { password, code } = z
      .object({ password: z.string(), code: z.string() })
      .parse(ctx.request.body);
    if (!isDefaultPassword() && code !== getGlobalData().resetPasswordCode) {
      ctx.body = { error: lang('验证码错误', 'Wrong Code') };
      return;
    }
    db.changeData((d) => {
      d.auth.adminPassword = password;
      d.auth.tokens = [];
    });
    ctx.body = { ok: 1 };
  });

  // 预登录，返回是否通过
  router.post(URL_PREFIX + 'login-admin', async (ctx: Ctx) => {
    const { password } = z
      .object({ password: z.string() })
      .parse(ctx.request.body);
    const verified = db.getData().auth.adminPassword === password;
    if (!verified) {
      ctx.body = { error: lang('密码错误', 'Wrong Password') };
      return;
    }
    ctx.body = { ok: 1 };
  });

  // 登录，设置cookie
  router.get(URL_PREFIX + 'login-admin', async (ctx: Ctx) => {
    const { password } = z
      .object({ password: z.string() })
      .parse(ctx.request.query);
    const verified = db.getData().auth.adminPassword === password;
    if (!verified) {
      ctx.body = { error: lang('密码错误', 'Wrong Password') };
      return;
    }
    ctx.cookies.set(COOKIE_NAME, generateAdminToken(), {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    console.log(
      `[${new Date().toLocaleString()}] User ${ctx.request.ip} logined.`
    );
    ctx.body = 'Login success, redirecting...';
    ctx.redirect('/');
  });

  // 登出，删除token
  router.get(URL_PREFIX + 'logout-admin', async (ctx: Ctx) => {
    const token = ctx.cookies.get(COOKIE_NAME);
    ctx.cookies.set(COOKIE_NAME, 'null', {
      maxAge: TOKEN_MAX_AGE,
    });
    db.changeData((d) => {
      d.auth.tokens = d.auth.tokens.filter((t) => t.token !== token);
    });
    ctx.body = 'Logout success, redirecting...';
    ctx.redirect('/');
  });
};

// 生成一个admin token并插入数据库，默认有效期72小时
function generateAdminToken() {
  const token = getRandomString(32);
  db.changeData((d) => {
    d.auth.tokens.push({
      token,
      expiresAt: now() + TOKEN_MAX_AGE,
      type: 'admin',
    });
  });
  return token;
}

// 检查是否是默认密码
function isDefaultPassword() {
  return db.getData().auth.adminPassword === defaultPassword;
}
