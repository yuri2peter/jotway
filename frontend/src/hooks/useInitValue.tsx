import { useState } from 'react';

export function useInitValue<T>(initValue: T) {
  const [v] = useState(initValue);
  return v;
}
