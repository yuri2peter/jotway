import React from 'react';
import MyWorker from 'src/workers/main.ts?worker';

type Caller = (type: string, data?: unknown) => Promise<unknown>;

const refHack: {
  current: Caller;
} = {
  current: () => Promise.resolve(null),
};

// 组件
export const WorkerHack: React.FC = () => {
  React.useLayoutEffect(() => {
    const w = new MyWorker();
    refHack.current = getWorkerCaller(w);
  }, []);
  return <></>;
};

// hack
export function workerCaller(type: string, data?: unknown) {
  return refHack.current(type, data);
}

// 获取Worker调用体，调用体提供了一个基于Pormise的交互方式
function getWorkerCaller(w: Worker) {
  return (type: string, data?: unknown) => {
    return new Promise((resolve) => {
      const randId = Math.random();
      const cb = (e: MessageEvent) => {
        const { id, data } = e.data;
        if (id === randId) {
          resolve(data);
          w.removeEventListener('message', cb);
        }
      };
      w.addEventListener('message', cb);
      w.postMessage({
        id: randId,
        type,
        data,
      });
    });
  };
}
