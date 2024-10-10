import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  updateUser,
  getUser,
  selectError,
  setError
} from '../../slices/storeSlice';
import { useLocation } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const error = useSelector(selectError);

  const { values, handleChange, setValues } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: ''
  });

  useEffect(() => {
    dispatch(getUser());
  }, [location]);

  useEffect(() => {
    setValues((prevState: TUser) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    values.name !== user?.name ||
    values.email !== user?.email ||
    !!values.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(values))
      .unwrap()
      .then(() => {
        dispatch(getUser());
        dispatch(setError(''));
      })
      .catch((err) => dispatch(setError(err.message)));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  useEffect(() => {
    dispatch(setError(''));
  }, [location]);

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
      updateUserError={error}
    />
  );
};
