import React from 'react';

export default function useUpdate(
  effect: () => void,
  deps: React.DependencyList | undefined
) {
  const refInit = React.useRef(false);
  React.useEffect(() => {
    if (refInit.current) {
      effect();
    } else {
      refInit.current = true;
    }
  }, deps);
}
