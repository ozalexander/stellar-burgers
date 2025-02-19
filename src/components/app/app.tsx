import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components';
import { ProtectedRoute } from '../ProtectedRoute';
import store, { useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIsAuthenticated,
  getUser,
  init,
  closeModal,
  selectIsModalOpen,
  setError
} from '../../slices/storeSlice';
import { useEffect } from 'react';
import { getCookie, deleteCookie } from '../../utils/cookie';
import { useLocation } from 'react-router-dom';

const App = () => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const token = getCookie('accessToken');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isModalOpen = useSelector(selectIsModalOpen);
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    if (!isAuthenticated && token) {
      dispatch(getUser())
        .unwrap()
        .then(() => {
          dispatch(init());
        })
        .catch((e) => {
          deleteCookie('accessToken');
          console.error(e);
          dispatch(init());
          localStorage.removeItem('refreshToken');
        });
    } else {
      dispatch(init());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const handleClose = () => {
    dispatch(closeModal());
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute notLoggedIn>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute notLoggedIn>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute notLoggedIn>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute notLoggedIn>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {isModalOpen && backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Заказ'
                onClose={() => {
                  handleClose();
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  handleClose();
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Мой заказ'
                  onClose={() => {
                    handleClose();
                  }}
                >
                  <OrderInfo personal />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
