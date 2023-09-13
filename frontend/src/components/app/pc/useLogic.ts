// pc主要业务逻辑
import { useEffect } from 'react';
import { getGlobalData } from 'src/store/globalData';
import { changeStore } from 'src/store/state';

export function useLogic() {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const gd = getGlobalData();
      // 检测 ctrl + k
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        changeStore((d) => {
          d.search.focus = true;
        });
        gd.focusSearchInput();
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, []);
}
