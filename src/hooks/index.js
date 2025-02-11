// utils/getAuthHeaders.js
import { store } from '@/store/store'; 

export const getAuthHeaders = () => {
  const state = store.getState(); 
  const token = state?.UserSignup?.data?.token;
  const langCode = state?.CurrentLanguage?.language?.code;

  return {
    authorization: token ? `Bearer ${token}` : undefined,
    'Content-Language': langCode,
  };
};