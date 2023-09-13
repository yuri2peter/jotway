import { useEffect } from 'react';

// 不允许手机网页缩放，可能会导致一些手势功能异常
export function useNoScale() {
  useEffect(() => {
    // 阻止双击放大
    let lastTouchEnd = 0;
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };
    // 阻止双指放大
    const handleGesturestart = (event: Event) => {
      event.preventDefault();
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('gesturestart', handleGesturestart);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd, false);
      document.removeEventListener('gesturestart', handleGesturestart);
    };
  }, []);
}
