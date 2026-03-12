import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import API from '../api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            checkAuth: async () => {
                const token = get().token;
                if (!token) {
                    set({ loading: false });
                    return;
                }
                try {
                    set({ loading: false });
                } catch (error) {
                    set({ user: null, token: null, loading: false });
                }
            },

            login: async (email, password, role) => {
                set({ user: null, token: null, loading: true, error: null });
                try {
                    const { data } = await API.post('/auth/login', { email, password, role });
                    set({ user: data, token: data.token, loading: false, error: null });
                    return data;
                } catch (error) {
                    const errorMsg = error.response?.data?.message || 'Login failed';
                    set({ user: null, token: null, error: errorMsg, loading: false });
                    throw error;
                }
            },

            googleLogin: async (credential, role, isAccessToken = false) => {
                set({ loading: true, error: null });
                try {
                    const { data } = await Promise.race([
                        API.post('/auth/google', { 
                            token: credential, 
                            role, 
                            isAccessToken 
                        }),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Request timeout')), 15000)
                        )
                    ]);
                    
                    set({ user: data, token: data.token, loading: false, error: null });
                    return data;
                } catch (error) {
                    const errorMsg = error.response?.data?.message || error.message || 'Google login failed';
                    set({ user: null, token: null, error: errorMsg, loading: false });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ user: null, token: null, loading: true, error: null });
                try {
                    const { data } = await API.post('/auth/register', userData);
                    set({ user: data, token: data.token, loading: false, error: null });
                    return data;
                } catch (error) {
                    const errorMsg = error.response?.data?.message || 'Registration failed';
                    set({ user: null, token: null, error: errorMsg, loading: false });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, token: null, error: null, loading: false });
                localStorage.removeItem('auth-storage');
            },

            setUser: (userData) => {
                set({ user: userData });
            },

            setError: (msg) => {
                set({ error: msg });
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
