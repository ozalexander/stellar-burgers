import { FC, useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';

import { setError, selectError } from '../../slices/storeSlice';
import { useSelector } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword: FC = () => {
  const { values, handleChange } = useForm({ email: '' });
  const error = useSelector(selectError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    forgotPasswordApi({ email: values.email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
        dispatch(setError(''));
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    dispatch(setError(''));
  }, [location]);

  return (
    <ForgotPasswordUI
      errorText={error}
      email={values.email}
      setEmail={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
