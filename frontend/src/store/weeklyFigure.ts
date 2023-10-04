import { writable } from 'svelte/store';
import type { LoginValues, RegisterValues, UserResponse } from '../utils';
import axios from 'axios';
import { storable } from './storable';

type TradestateType = {
	trades: any | null;
	loading: boolean;
	message: string | null;
	error: boolean;
	success: boolean;
};

// const baseURL = '';
// const instance = axios.create({
// 	baseURL: 'https://trade-accounting-demo.onrender.com/api/weeklyfigures', // Replace with your API's base URL
// 	headers: {
// 		'Content-Type': 'application/json', // Adjust content type as needed
// 		'Access-Control-Allow-Origin': 'http://127.0.0.1:5173'
// 	}
// });

const baseURL: string = "https://trade-accounting-demo.onrender.com/api/weeklyfigures"
//"http://127.0.0.1:7001/api/weeklyfigures";

const userStore = storable<UserResponse | null>('user', null);

const createTradeStore = () => {
	const { subscribe, set, update } = writable<TradestateType>({
		trades: null,
		loading: false,
		message: null,
		error: false,
		success: false
	});

	const setLoading = (isLoading: boolean) => {
		update((s: TradestateType) => ({ ...s, loading: isLoading }));
	};

	return {
		subscribe,
		getTrades: async () => {
			try {
				setLoading(true);

				const res = await axios.get(`${baseURL}/retrive`);

				set({
					trades: res.data.data.data,
					loading: false,
					error: false,
					message: null,
					success: true
				});
			} catch (error: any) {
				set({
					trades: null,
					loading: false,
					error: true,
					message: error.response.data.error,
					success: false
				});
			}
		}
	};
};

export const useTradeStore = createTradeStore();
