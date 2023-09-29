import { writable } from 'svelte/store';
import type { LoginValues, RegisterValues, UserResponse } from '../utils';
import axios from 'axios';
import { storable } from './storable';

type AuthStateType = {
	user: UserResponse | null;
	loading: boolean;
	message: string | null;
	error: boolean;
	success: boolean;
};

axios.defaults.baseURL = 'http://localhost:7001/api/users';

const userStore = storable<UserResponse | null>('user', null);

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthStateType>({
		user: null,
		loading: false,
		message: null,
		error: false,
		success: false
	});

	const setLoading = (isLoading: boolean) => {
		update((s: AuthStateType) => ({ ...s, loading: isLoading }));
	};

	return {
		subscribe,
		login: async (loginData: LoginValues) => {
			try {
				setLoading(true);

				const { data } = await axios.post('/login', loginData);
				console.log(data);

				userStore.set(data.data);

				set({
					user: data.data,
					loading: false,
					error: false,
					message: null,
					success: true
				});
			} catch (error: any) {
				set({
					user: null,
					loading: false,
					error: true,
					message: error.response.data.error,
					success: false
				});
			}
		},
		register: async (registerData: RegisterValues) => {
			try {
				setLoading(true);

				const { data } = await axios.post('/create', registerData);

				userStore.set(data.data);

				set({
					user: data.data,
					loading: false,
					error: false,
					message: null,
					success: true
				});
			} catch (error: any) {
				set({
					user: null,
					loading: false,
					error: true,
					message: error.response.data.error,
					success: false
				});
			}
		}
	};
};

export const useAuthStore = createAuthStore();
