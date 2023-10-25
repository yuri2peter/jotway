import React, { useEffect } from 'react';
import Background from 'src/components/app/miscs/Background';
import { useStore } from 'src/store/state';
import { updateLocalWallpaper } from 'src/store/state/actions/settings';

const BackgroundLoader: React.FC = () => {
  const { settings } = useStore();
  useEffect(() => {
    updateLocalWallpaper(settings);
  }, [settings]);
  return <Background />;
};

export default BackgroundLoader;
