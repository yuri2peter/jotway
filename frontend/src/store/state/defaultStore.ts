import {
  Linker,
  Settings,
  getDefaultSettings,
  getNewLinker,
} from '@local/common';
import { now } from 'lodash';
import { createSelector } from 'reselect';
import { TagClass } from './types';

export interface Store {
  appearance: {
    langType: 'en' | 'zh';
    bgImage: string;
    mobileAtTop: boolean; // 手机视图时，是否已置顶
    aboutModalOpen: boolean; // 关于模态框
    tagMenuTagName: string; // 临时记录是哪个标签被右键点击了
    blockMenuBlockId: string; // 临时记录是哪个Block被右键点击了
    isMobile: boolean; // 记录是否是手机尺寸
  };
  search: {
    inputValue: string;
    text: string;
  };
  linkerForm: {
    open: boolean;
    create: boolean;
    linker: Linker;
  };
  linkers: Linker[];
  query: {
    tag: string;
    tagClass: TagClass;
    keyword: string;
    pageIndex: number;
  };
  settings: Settings;
  systemForm: {
    settings: Settings;
    modalOpen: boolean;
    tabIndex: number;
  };
}

export const defaultStore: Store = {
  appearance: {
    langType: 'en',
    bgImage: '',
    mobileAtTop: true,
    aboutModalOpen: false,
    tagMenuTagName: '',
    blockMenuBlockId: '',
    isMobile: false,
  },
  search: {
    inputValue: '',
    text: '',
  },
  linkerForm: {
    open: false,
    create: false,
    linker: getNewLinker(),
  },
  linkers: [],
  query: {
    tag: '',
    tagClass: 'all',
    keyword: '',
    pageIndex: 0,
  },
  settings: getDefaultSettings(),
  systemForm: {
    settings: getDefaultSettings(),
    modalOpen: false,
    tabIndex: 0,
  },
};

export const selectLinkers = (state: Store) => state.linkers;
export const selectQuery = (state: Store) => state.query;
export const selectIsMobile = (state: Store) => state.appearance.isMobile;
export const selectIsKeywordMode = (state: Store) =>
  state.query.tagClass === 'keyword';

// 添加_text字段
const selectLinkerFixed = createSelector([selectLinkers], (linkers) => {
  return linkers
    .map((t) => {
      return {
        ...t,
        _text: [t.name, ...t.tags, t.desc, t.content, t.url].join(' | '),
      };
    })
    .sort((a, b) => {
      if (a.pin === b.pin) {
        return b.accessCount - a.accessCount;
      }
      if (a.pin) {
        return -1;
      }
      return 1;
    });
});

// 按关键字、tag过滤
export const selectLinkerFilterd = createSelector(
  [selectLinkerFixed, selectQuery],
  (linkers, { tag, keyword, tagClass }) => {
    return linkers.filter((t) => {
      if (keyword) {
        return t._text.toLowerCase().includes(keyword.toLowerCase());
      }
      if (tag) {
        return t.tags.includes(tag);
      }
      if (tagClass === 'unclassified') {
        return t.tags.length === 0;
      }
      if (tagClass === 'recently') {
        return isRecently(t);
      }
      return true;
    });
  }
);

// 统计所有tag
export const selectTagCounts = createSelector([selectLinkers], (linkers) => {
  const tags: {
    [k: string]: {
      numCount: number;
      accessCount: number;
    };
  } = {};
  linkers.forEach((l) => {
    l.tags.forEach((t) => {
      if (!tags[t]) {
        tags[t] = {
          numCount: 1,
          accessCount: l.accessCount,
        };
      } else {
        tags[t].numCount += 1;
        tags[t].accessCount += l.accessCount;
      }
    });
  });
  const tags1 = Object.keys(tags).map((t) => {
    return {
      name: t,
      weight: tags[t].accessCount / tags[t].numCount + tags[t].numCount * 0.02, // 用总访问 / 总次数 + 次数 * q，得到权重
      numCount: tags[t].numCount,
    };
  });
  // 按权重排序，高权重意味着该tag分类下的linker平均访问次数较高
  return tags1.sort((a, b) => {
    return b.weight - a.weight;
  });
});

// 摘取tag的名字
export const selectTags = createSelector([selectTagCounts], (tagCounts) => {
  return tagCounts.map((t) => t.name);
});

// 未分类的对象的数量统计
export const selectUnClassifiedLinkersCount = createSelector(
  [selectLinkers],
  (linkers) => {
    return linkers.filter((l) => l.tags.length === 0).length;
  }
);

// 左侧标签选择器宽度
export const selectTagMenuWidth = createSelector(
  [selectIsMobile],
  (isMobile) => {
    return isMobile ? 'calc(100% - 284px)' : 160;
  }
);

// 最近的对象的数量统计
export const selectRecentlyLinkersCount = createSelector(
  [selectLinkers],
  (linkers) => {
    return linkers.filter(isRecently).length;
  }
);

function isRecently(linker: Linker) {
  const nowTime = now();
  const timeBound = 60 * 60 * 1000; // 最近一小时
  return (
    nowTime - linker.createdAt < timeBound ||
    nowTime - linker.accessAt < timeBound
  );
}

// 全部对象的数量统计
export const selectAllLinkersCount = createSelector(
  [selectLinkers],
  (linkers) => {
    return linkers.length;
  }
);

// 当前搜索对象的数量统计
export const selectSearchLinkersCount = createSelector(
  [selectLinkerFilterd, selectIsKeywordMode],
  (linkers, isKeywordMode) => {
    return isKeywordMode ? linkers.length : 0;
  }
);
