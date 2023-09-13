import path from 'path';
import { IS_PROD, ROOT_PATH } from './configs';
import JsonDb from './libs/jsonDb';
import { defaultData } from '@local/common';

const dbFile = path.resolve(ROOT_PATH, './data/db/main.json');
const dbBackUpDir = path.resolve(ROOT_PATH, './data/db/main_backup');
const defaultValue = defaultData;
const version = 4;

export const db = new JsonDb({
  file: dbFile,
  backup: {
    dir: dbBackUpDir,
    cronExp: '*/30 * * * *',
    maxBackups: 150,
  },
  version,
  defaultValue,
  debug: !IS_PROD,
  versionFixer: (record, changeData) => {
    if (record.version !== version) {
      console.log('Inconsistent data version detected, fixing...');
      fixer(record.version, changeData);
      console.log('Data version fixed.');
    }
  },
});

// 初始化时对数据库进行的操作
export async function initDb() {
  db.changeData((d) => {});
}

function fixer(
  version: number,
  changeData: (recipe: (base: unknown) => void) => void
) {
  if (version === 3) {
    changeData(v3ToV4);
    fixer(4, changeData);
    return;
  }
}

function v3ToV4(data: any) {}
