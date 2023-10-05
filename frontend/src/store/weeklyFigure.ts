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



const baseURL: string = "https://trade-accounting-demo.onrender.com/api/weeklyfigures"
// const baseURL: string = "http://127.0.0.1:7001/api/weeklyfigures";

export const weeklyFigStore = writable([]);

const UploadeWeeeklyFigStore = () => {
	// transactionStore.subscribe(($transactionStore) => $transactionStore);

	return {
		get: async () => {
			try {
				const { data } = await axios.get(`${baseURL}/retrive`);

				console.log("Weekly Fig Data", data);

				weeklyFigStore.set(data.data.data);

			} catch (error: any) {
				weeklyFigStore.set([]);
			}
		},
	}
};


export const uploadeWeeeklyFigStore = UploadeWeeeklyFigStore();
