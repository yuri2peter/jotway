import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppGuard from 'src/layouts/AppGuard';
import Loadable from 'src/components/miscs/Loadable';
import FlexLayout from 'src/layouts/FlexLayout';

const HomePage = Loadable(lazy(() => import('src/pages/home')));
const LoginPage = Loadable(lazy(() => import('src/pages/login')));
const ResetPage = Loadable(lazy(() => import('src/pages/reset-password')));

function MainRoute() {
  return (
    <Routes>
      <Route path="/" element={<AppGuard />}>
        <Route path="/" element={<FlexLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default MainRoute;
