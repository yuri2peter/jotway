import { db } from '../db';

export function lang<T = string>(zh: T, en: T): T {
  return db.getData().settings.langType === 'zh' ? zh : en;
}
