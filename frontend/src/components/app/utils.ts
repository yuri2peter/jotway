import { Linker } from '@local/common';
import { getStore } from 'src/store/state';

export function calcLinkerOpenUrl(linker: Linker) {
  if (linker.article) {
    return `/a/${linker.id}`;
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

// 显示语言2 (使用localStorage)
export function lang2<T>(zh: T, en: T): T {
  if (localStorage.getItem('langType') === 'zh') {
    return zh;
  } else {
    return en;
  }
}
