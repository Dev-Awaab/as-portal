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

export const weeklyFigStore = writable([]);

const UploadeWeeeklyFigStore = () => {
	// transactionStore.subscribe(($transactionStore) => $transactionStore);

	return {
		get: async () => {
			try {
				const { data } = await axios.get(`${baseURL}/retrive`);
				// console.log(data);

				weeklyFigStore.set(data.data.data);

			} catch (error: any) {
				weeklyFigStore.set([]);
			}
		},
	}
};


export const uploadeWeeeklyFigStore = UploadeWeeeklyFigStore();
