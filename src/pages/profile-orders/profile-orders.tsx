import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { selectUserOrders, fetchUsersOrders } from '../../slices/storeSlice';
import { useDispatch } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUsersOrders());
  }, [location]);

  return <ProfileOrdersUI orders={orders} />;
};
