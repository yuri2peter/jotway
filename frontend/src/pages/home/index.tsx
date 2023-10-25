import MainPage from 'src/components/app/Main';
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
  if (!ready) {
    return null;
  }
  return <MainPage />;
};

export default HomePage;
