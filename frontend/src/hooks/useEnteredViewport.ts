// useEnteredViewport.ts
// 是否进入过视口
import { useInViewport } from 'react-in-viewport';
import React, { useEffect } from 'react';

export default function useEnteredViewport(): [
  React.MutableRefObject<null>,
  boolean
] {
  const myRef = React.useRef(null);
  const [entered, setEntered] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  useEffect(() => {
    if (!entered && inViewport) {
      setEntered(true);
    }
  }, [inViewport, entered]);
  return [myRef, entered];
}
