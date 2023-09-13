export const TagSelectOptions: {
  [k: string]: [string, string];
} = {
  // keyword = '关键字',
  // tagSelected = '标签限定',
  all: ['全部', 'All'],
  recently: ['最近', 'Recently'],
  unclassified: ['无标签', 'Unclassified'],
};

export type TagClass =
  | 'keyword'
  | 'tagSelected'
  | 'all'
  | 'recently'
  | 'unclassified';
