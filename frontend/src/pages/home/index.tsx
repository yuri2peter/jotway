import { useLayoutContext } from 'src/layouts/FlexLayout/sections/context';
import PcPage from 'src/components/app/pc';
import MobilePage from 'src/components/app/mobile';
import { useLayoutEffect, useState } from 'react';
import { useVisibilityChange } from 'src/hooks/useVisibilityChange';
import { syncFromServer } from 'src/store/state/actions/app';

const HomePage = () => {
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    (async () => {
      await syncFromServer();
      setReady(true);
    })();
  });
  // 页面tab激活时，重载数据
  useVisibilityChange(async (visible) => {
    if (visible) {
      await syncFromServer();
    }
  });
  const { isMobile } = useLayoutContext();
  if (!ready) {
    return null;
  }
  return isMobile ? <MobilePage /> : <PcPage />;
};

export default HomePage;
