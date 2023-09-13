import Router from 'koa-router';
import { test } from './test';
import { upload } from './upload';
import { utils } from './utils';
import { linker } from './linker';
import { settings } from './settings';
import { auth } from './auth';
import { system } from './system';

export function main(router: Router<any, {}>) {
  [test, upload, utils, linker, settings, auth, system].forEach((t) =>
    t(router)
  );
}
