import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import {
  selectError,
  loginUser,
  setError,
  getUser
} from '../../slices/storeSlice';
import { useSelector } from '../../services/store';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const error = useSelector(selectError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      dispatch(setError('Необходимо заполнить все поля'));
      return;
    }
    dispatch(loginUser({ email: values.email, password: values.password }))
      .unwrap()
      .then((res) => {
        localStorage.setItem('refreshToken', res.refreshToken);
        setCookie('accessToken', res.accessToken);
        dispatch(getUser());
        dispatch(setError(''));
      })
      .catch((err) => dispatch(setError(err.message)));
  };

  useEffect(() => {
    dispatch(setError(''));
  }, [location]);

  return (
    <LoginUI
      errorText={error}
      email={values.email}
      setEmail={handleChange}
      password={values.password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
