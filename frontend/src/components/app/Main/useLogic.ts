// 副作用和监听
import { useEffect } from 'react';
import { getGlobalData } from 'src/store/globalData';

export function useLogic() {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const gd = getGlobalData();
      // 检测 ctrl + k
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        gd.focusSearchInput();
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, []);
}
