import { DebouncedFunc, debounce } from 'lodash';
import { useMemo } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  cb: T,
  deps: any[] = [],
  delay = 1000
): DebouncedFunc<T> {
  return useMemo(() => {
    return debounce(cb, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, deps, delay]);
}
