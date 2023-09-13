import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const refHack = {
  current: (() => {}) as NavigateFunction,
};

export const NavigationHack: React.FC = () => {
  const nav = useNavigate();
  refHack.current = nav;
  return null;
};

export function navigate(to: string) {
  refHack.current(to);
}

export function navigateGoBack() {
  refHack.current(-1);
}
