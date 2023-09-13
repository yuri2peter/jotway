import { createStore } from '@yuri2/arrow-frog';
import { defaultStore } from './defaultStore';

export const { getStore, useSelector, changeStore, StoreProvider, useStore } =
  createStore(defaultStore);
