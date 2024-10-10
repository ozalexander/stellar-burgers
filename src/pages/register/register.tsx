import { FC, SyntheticEvent, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerNewUser,
  getUser,
  setError,
  selectError
} from '../../slices/storeSlice';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const error = useSelector(selectError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.password) {
      return dispatch(setError('Необходимо заполнить все поля'));
    }
    dispatch(
      registerNewUser({
        name: values.name,
        email: values.email,
        password: values.password
      })
    )
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
    <RegisterUI
      errorText={error}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={handleChange}
      setPassword={handleChange}
      setUserName={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
