// 全局内存数据引用（非react状态管理）

interface GlobalData {
  focusSearchInput: () => void;
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
  return { focusSearchInput: () => {} };
}
