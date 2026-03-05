import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,

  login: (userData, token) => {
    localStorage.setItem('access_token', token);
    set({ user: userData, token });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
}));

export default useAuthStore;