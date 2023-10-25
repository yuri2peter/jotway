// 副作用和监听
import { useEffect } from 'react';
import { useLayoutContext } from 'src/layouts/FlexLayout/sections/context';
import { getGlobalData } from 'src/store/globalData';
import { changeStore } from 'src/store/state';

export function useLogic() {
  const { width } = useLayoutContext();
  const isMobile = width < 600;
  useEffect(() => {
    changeStore((d) => {
      d.appearance.isMobile = isMobile;
    });
  }, [isMobile]);

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
