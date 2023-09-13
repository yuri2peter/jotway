import { useCallback, KeyboardEventHandler } from 'react';

export function useTextAreaEnterKey(onEnterStandalone = () => {}) {
  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLElement>>(
    (event) => {
      if (event.key === 'Enter') {
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          // 正常换行
        } else {
          event.preventDefault();
          onEnterStandalone();
        }
      }
    },
    [onEnterStandalone]
  );
  return handleKeyDown;
}
