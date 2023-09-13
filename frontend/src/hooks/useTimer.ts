import { useState, useEffect } from 'react';

// 发出定时器脉冲,返回脉冲时间戳
export function useTimer(interval = 1000): number {
  const [time, setTime] = useState(new Date().getTime());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().getTime());
    }, interval);
    return () => {
      clearInterval(timer);
    };
  }, [interval]);
  return time;
}
