// 消息分发至函数
self.onmessage = async function (event: MessageEvent) {
  const { id, type, data } = event.data;
  const reply = (answer: unknown) => {
    self.postMessage({ id, data: answer });
  };
  const action = actions[type as keyof typeof actions];
  if (action) {
    const answer = await action(data);
    reply(answer);
  }
};

// 框架要求作导出声明
export const _ = 'WORKER';

// 处理函数集合
const actions = {
  test: (data: unknown) => {
    console.log('test:', data);
    return 'passed';
  },
};
