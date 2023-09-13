import {
  Linker,
  Settings,
  getDefaultSettings,
  getNewLinker,
} from '@local/common';
import { clamp, now } from 'lodash';
import { createSelector } from 'reselect';
import { TagClass, TagSelectOptions } from './types';
import { Pin } from '@mui/icons-material';

export interface Store {
  appearance: {
    langType: 'en' | 'zh';
    bgImage: string;
    mobileAtTop: boolean; // 手机视图时，是否已置顶
    aboutModalOpen: boolean;
    tagMenuTagName: string; // 临时记录是哪个标签被右键点击了
  };
  search: {
    inputValue: string;
    text: string;
    focus: boolean;
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
  },
  search: {
    inputValue: '',
    text: '',
    focus: false,
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
const selectSearchText = (state: Store) => state.search.text;
const selectQueryPageIndex = (state: Store) => state.query.pageIndex;
const pageSize = 6 * 6;

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
    const nowTime = now();
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
        const timeBound = 60 * 60 * 1000; // 最近一小时
        return (
          nowTime - t.createdAt < timeBound || nowTime - t.accessAt < timeBound
        );
      }
      return true;
    });
  }
);

// 生成page参数
export const selectPageParams = createSelector(
  [selectLinkerFilterd, selectQueryPageIndex],
  (linkers, pageIndex) => {
    const minPageIndex = 0;
    const maxPageIndex = Math.ceil(linkers.length / pageSize) - 1;
    const pageIndexFixed = clamp(pageIndex, minPageIndex, maxPageIndex);
    return { minPageIndex, maxPageIndex, pageIndex: pageIndexFixed };
  }
);

// 按页数显示
export const selectLinkerList = createSelector(
  [selectLinkerFilterd, selectPageParams],
  (linkers, { pageIndex }) => {
    return linkers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }
);

// 内部搜索预览搜索结果数目
export const selectInsiderLinkers = createSelector(
  [selectLinkerFixed, selectSearchText],
  (linkers, keyword) => {
    return linkers.filter((t) => {
      const keywordMatch = keyword
        ? t._text.toLowerCase().includes(keyword.toLowerCase())
        : true;
      return keywordMatch;
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

// 是否有未分类的对象
export const selectHasUnClassified = createSelector(
  [selectLinkers],
  (linkers) => {
    return linkers.some((l) => l.tags.length === 0);
  }
);
