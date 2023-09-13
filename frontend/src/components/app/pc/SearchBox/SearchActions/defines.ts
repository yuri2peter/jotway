import { Linker } from '@local/common';
import React, { useContext } from 'react';

export type Action =
  | {
      type: 'ActionAddUrlLinker';
      url: string;
    }
  | {
      type: 'ActionInsiderSearchOne';
      linker: Linker;
      text: string;
      _text: string;
      multi: true;
    }
  | {
      type: 'ActionInsiderSearchMore';
      text: string;
      count: number;
    }
  | {
      type: 'ActionWwwSearch';
      text: string;
    }
  | {
      type: 'AddArticlelLinker';
      text: string;
    };
export const MyContext = React.createContext({
  actions: [] as Action[],
  selectedIndex: 0,
  setSelectedIndex: (v: number) => {},
  refHandleSubmit: { current: () => {} },
});

export function useMyContext() {
  return useContext(MyContext);
}
