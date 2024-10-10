import { setCookie, getCookie } from './cookie';
import { TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => Promise.reject(err));
};

const checkSuccess = (res: TServerResponse<any>) => {
  if (res && res.success) {
    return res;
  }
  return Promise.reject(`Ответ не success: ${res}`);
};

const request = (endpoint: string, options?: any) =>
  fetch(`${URL}${endpoint}`, options)
    .then((res) => checkResponse(res))
    .then((res) => checkSuccess(res));

const options = (method: string, authorization: boolean, data?: any) => {
  const accessToken = getCookie('accessToken');
  return {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...(authorization &&
        accessToken && {
          authorization: accessToken
        })
    },
    ...((method === 'POST' || method === 'PATCH') && {
      body: JSON.stringify(data)
    })
  };
};

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  request(
    `${URL}/auth/token`,
    options('POST', false, { token: localStorage.getItem('refreshToken') })
  ).then((refreshData) => {
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
  });

export const fetchWithRefresh = async <T>(url: RequestInfo, options: any) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse(res);
    } else {
      return Promise.reject(err);
    }
  }
};

export const getIngredientsApi = () =>
  request(`/ingredients`).then((res) => res.data);

export const getFeedsApi = () => request(`/orders/all`);

export const getOrdersApi = () =>
  fetchWithRefresh(`${URL}/orders`, options('GET', true));

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh(
    `${URL}/orders`,
    options('POST', true, { ingredients: data })
  );

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export const registerUserApi = (data: TRegisterData) =>
  request(`/auth/register`, options('POST', false, data));

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  request(`/auth/login`, options('POST', false, data));

export const forgotPasswordApi = (data: { email: string }) =>
  request(`/password-reset`, options('POST', false, data));

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request(`/password-reset/reset`, options('POST', false, data));

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, options('GET', true));

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(
    `${URL}/auth/user`,
    options('PATCH', true, user)
  );

export const logoutApi = () =>
  request(
    `/auth/logout`,
    options('POST', false, { token: localStorage.getItem('refreshToken') })
  );
