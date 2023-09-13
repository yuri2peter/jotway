import { throttle } from 'lodash';
import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { RENDER_MODES, config } from '../config';
import { IS_DEV } from 'src/configs';
import { ContentValues } from './context';

export function useWatchSize({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [content, setContent] = useState<ContentValues>({
    width: 0,
    height: 0,
    mode: 'INIT',
    isMobile: false,
  });
  const refCache = useRef({
    width,
    height,
  });
  refCache.current = {
    width,
    height,
  };
  const responseSize = useCallback(() => {
    const vw = refCache.current.width;
    const vh = refCache.current.height;
    const [b1, b2] = config.breakpoints;
    const [ww, wh] = config.windowSize;
    const values: ContentValues = {
      width: vw,
      height: vh,
      mode: 'INIT',
      isMobile: false,
    };
    if (vw === 0 && vh === 0) {
      Object.assign(values, {
        mode: 'INIT',
        isMobile: false,
      });
    } else if (vw < b1) {
      Object.assign(values, {
        mode: 'MOBILE',
        isMobile: true,
      });
    } else if (vw < b2) {
      Object.assign(values, {
        mode: 'DESKTOP',
        isMobile: false,
      });
    } else {
      Object.assign(values, {
        width: ww,
        height: wh,
        mode: 'WINDOW',
        isMobile: false,
      });
    }
    setContent(values);
    if (IS_DEV && config.showDevInfo) {
      console.log(
        `[FlexLayout] ${RENDER_MODES[values.mode]} 屏幕尺寸: ${vw} x ${vh}`
      );
    }
  }, []);
  const watchSizeThrottle = useMemo(() => {
    return throttle(responseSize, 500);
  }, [responseSize]);
  useEffect(() => {
    watchSizeThrottle();
  }, [width, height, watchSizeThrottle]);
  return content;
}
