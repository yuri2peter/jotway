// 全局内存数据引用

import { getRandomString } from '../utils/miscs';

interface GlobalData {
  resetPasswordCode: string; // 用于密码重置的动态code
}

const data: GlobalData = getInitialGlobalData();

// 获取全局data的引用
export function getGlobalData(): GlobalData {
  return data;
}

// 重置为初始状态
export function resetGlobalData() {
  Object.assign(data, getInitialGlobalData());
}

// 空数据模板
function getInitialGlobalData(): GlobalData {
  return {
    resetPasswordCode: getRandomString(8),
  };
}
