import react, { useContext } from 'react';
import { RENDER_MODES } from '../config';

export interface ContentValues {
  width: number;
  height: number;
  mode: keyof typeof RENDER_MODES;
  isMobile: boolean;
}

const context = react.createContext<ContentValues>({
  width: 0,
  height: 0,
  mode: 'INIT',
  isMobile: false,
});

export const ContextProvider = context.Provider;
export const useLayoutContext = () => useContext(context);
