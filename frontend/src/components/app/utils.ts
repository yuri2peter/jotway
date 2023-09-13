import { Linker } from '@local/common';
import { getStore } from 'src/store/state';

export function calcLinkerOpenUrl(linker: Linker) {
  if (linker.article) {
    return `/article/index.html?id=${linker.id}`;
  }
  return linker.url;
}

// 显示语言
export function lang<T>(zh: T, en: T): T {
  const {
    appearance: { langType },
  } = getStore();
  if (langType === 'zh') {
    return zh;
  } else {
    return en;
  }
}
