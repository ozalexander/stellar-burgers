import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  createNewOrder,
  selectConstructorItems,
  selectOrderRequest,
  resetOrder
} from '../../slices/storeSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(
    (state: RootState) => state.store.orderModalData
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.store.isAuthenticated
  );

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (constructorItems.bun && constructorItems.bun._id) {
      dispatch(
        createNewOrder([
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((item) => item._id),
          constructorItems.bun._id
        ])
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price! * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
