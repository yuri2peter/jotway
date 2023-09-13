import { useState, useMemo } from 'react';
import { produce } from 'immer';
import { Draft } from 'immer/dist/internal';

export const useImmer = <T extends {}>(
  initialState: T
): [T, (recipe: (draft: Draft<T>) => void) => void] => {
  const [data, setData] = useState(initialState);
  const changeData = useMemo(() => {
    return (recipe: (draft: Draft<T>) => void) => {
      setData((prev) => {
        return produce(prev, recipe);
      });
    };
  }, []);
  return [data, changeData];
};
export type ChangeState<T extends {}> = (
  recipe: (draft: Draft<T>) => void
) => void;
