import { changeStore } from '..';

export function resetSearch() {
  changeStore((d) => {
    d.search.focus = false;
    d.search.inputValue = '';
    d.search.text = '';
  });
}
