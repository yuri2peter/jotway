import { useEffect, useRef } from 'react';

export function useVisibilityChange(cb: (visible: boolean) => void) {
  const refCb = useRef(cb);
  refCb.current = cb;
  useEffect(() => {
    const handle = () => {
      refCb.current(!document.hidden);
    };
    document.addEventListener('visibilitychange', handle);
    return () => {
      document.removeEventListener('visibilitychange', handle);
    };
  }, []);
}
