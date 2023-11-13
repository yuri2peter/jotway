import React, { useEffect } from 'react';
import { use100vh } from 'react-div-100vh';
import { useWatchSize } from './sections/useWatchSize';
import { useResizeDetector } from 'react-resize-detector';
import { ContextProvider } from './sections/context';
import ParentBox from './sections/ParentBox';
import ContentBox from './sections/ContentBox';
import { changeStore } from 'src/store/state';

/**
 * 万能弹性布局器
 */
const FlexLayout: React.FC<{}> = () => {
  const height100vh = use100vh();
  const { width, height, ref } = useResizeDetector();
  const content = useWatchSize({
    width: width || 0,
    height: height || 0,
  });
  const { mode } = content;
  const fullScreen = ['MOBILE', 'DESKTOP'].includes(mode);
  const isMobile = (width ?? 0) < 600;
  useEffect(() => {
    changeStore((d) => {
      d.appearance.isMobile = isMobile;
    });
  }, [isMobile]);
  return (
    <ContextProvider value={content}>
      <ParentBox sizerRef={ref} height={height100vh || 0}>
        {height100vh && <ContentBox fullScreen={fullScreen} />}
      </ParentBox>
    </ContextProvider>
  );
};

export default FlexLayout;
