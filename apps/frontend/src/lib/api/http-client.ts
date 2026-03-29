import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 = backend rejected the token (expired or invalid) → force sign-out
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/auth/signin' });
      return Promise.reject(error);
    }
    const message =
      error.response?.data?.message ?? error.message ?? 'An error occurred';
    return Promise.reject(new Error(message));
  },
);

export default httpClient;
