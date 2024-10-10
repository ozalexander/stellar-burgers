import { FC } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { deleteCookie } from '../../utils/cookie';
import { logOutUser } from '../../slices/storeSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOutUser())
      .unwrap()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      });
    redirect('/');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
