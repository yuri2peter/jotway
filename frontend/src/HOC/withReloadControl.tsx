// 高阶组件。注入一个方法reload，使得子组件重新加载。
// 重新加载使得生命周期较为安全。
import React from 'react';

export default function withReloadControl<T>(
  WrappedComponent: React.FC<T & { reload: () => void }>
): React.FC<T> {
  const Warped = (props: T) => {
    const [show, setShow] = React.useState(true);
    const reload = React.useCallback(() => {
      setShow(false);
      setTimeout(() => {
        setShow(true);
      });
    }, []);
    return show ? <WrappedComponent {...props} reload={reload} /> : null;
  };
  return Warped;
}
