import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';
import { selectIsInit } from '../../slices/storeSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  notLoggedIn?: boolean;
};

export const ProtectedRoute = ({
  children,
  notLoggedIn
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isInit = useSelector(selectIsInit);
  const isAuthenticated = useSelector(
    (state: RootState) => state.store.isAuthenticated
  );

  if (!isInit) {
    return <Preloader />;
  }

  if (!isAuthenticated && !notLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isAuthenticated && notLoggedIn) {
    return <Navigate to={location.state.from || '/'} replace />;
  }

  return children;
};
