import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { selectUserOrders, fetchUsersOrders } from '../../slices/storeSlice';
import { useDispatch } from '../../services/store';
import { useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectUserOrders);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUsersOrders());
  }, [location]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
