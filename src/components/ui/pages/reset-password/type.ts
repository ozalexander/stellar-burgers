import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email' | 'setEmail'> & {
  password: string;
  token: string;
  setPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
