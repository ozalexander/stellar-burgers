import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';
import { useDispatch, useSelector } from '../../services/store';
import { setError, selectError } from '../../slices/storeSlice';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectError);
  const { values, handleChange } = useForm({ password: '', token: '' });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    resetPasswordApi({ password: values.password, token: values.token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
        dispatch(setError(''));
      })
      .catch((err) => dispatch(setError(err.message)));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={values.password}
      token={values.token}
      setPassword={handleChange}
      setToken={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
