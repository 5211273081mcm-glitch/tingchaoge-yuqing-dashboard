import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import NotFound from './pages/NotFound/NotFound';
import DashboardAprilPage from './pages/DashboardAprilPage/DashboardAprilPage';
import DashboardMayPage from './pages/DashboardMayPage/DashboardMayPage';
import DashboardJunePage from './pages/DashboardJunePage/DashboardJunePage';
import DashboardJulyPage from './pages/DashboardJulyPage/DashboardJulyPage';
import DashboardAugustPage from './pages/DashboardAugustPage/DashboardAugustPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardAugustPage />} />
        <Route path="/august" element={<DashboardAugustPage />} />
        <Route path="/july" element={<DashboardJulyPage />} />
        <Route path="/june" element={<DashboardJunePage />} />
        <Route path="/may" element={<DashboardMayPage />} />
        <Route path="/april" element={<DashboardAprilPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
