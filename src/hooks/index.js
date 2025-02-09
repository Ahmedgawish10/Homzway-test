// utils/getAuthHeaders.js
import { store } from '@/store/store'; // Import store here

export const getAuthHeaders = () => {
  const state = store.getState(); // Access store dynamically
  const token = state?.UserSignup?.data?.token;
  const langCode = state?.CurrentLanguage?.language?.code;

  return {
    authorization: token ? `Bearer ${token}` : undefined,
    'Content-Language': langCode,
  };
};