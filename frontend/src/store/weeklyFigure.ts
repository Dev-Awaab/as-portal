import { get, writable } from 'svelte/store';
import type { LoginValues, RegisterValues, UserResponse } from '../utils';
import axios from 'axios';
import { storable } from './storable';
import { serverInstance } from '../utils/baseUrl';

type TradestateType = {
	trades: any | null;
	loading: boolean;
	message: string | null;
	error: boolean;
	success: boolean;
};

// import { writable } from 'svelte/store';
// import axios from 'axios';

// const baseURL: string = "https://trade-accounting-demo.onrender.com/api/weeklyfigures"
// // const baseURL: string = "http://127.0.0.1:7001/api/weeklyfigures";

// export const weeklyFigStore = writable([]);

// const UploadeWeeeklyFigStore = () => {

// 	return {
// 		get: async () => {
// 			try {
// 				const { data } = await axios.get(`${baseURL}/retrive`);

// 				console.log("Weekly Fig Data", data);

// 				weeklyFigStore.set(data.data.data);

// 			} catch (error: any) {
// 				weeklyFigStore.set([]);
// 			}
// 		},
// 	}
// };

// const baseURL: string = "https://trade-accounting-demo.onrender.com/api/weeklyfigures"
// const baseURL: string = "http://127.0.0.1:7001/api/weeklyfigures";
const baseURL: string = "/api/weeklyfigures"

// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/weeklyfigures';

// Create a store with loading state
const weeklyFigStore = writable({
	data: [],
	loading: false,
	message: null,
	error: false,
	success: false,
	noData: false,
});

const UploadeWeeeklyFigStore = () => {
	return {
		get: async () => {
			try {
				const { data } = await serverInstance.get(`${baseURL}/retrive`);

				console.log("Weekly Fig Data", data);

				// Set loading to true when fetching
				weeklyFigStore.update((state) => ({ ...state, loading: true }));
				weeklyFigStore.set({
					data: data.data.data,
					loading: false,
					error: false,
					message: data.message,
					success: true,
					noData: data.data.data.length > 0 ? false : true
				});
			} catch (error: any) {
				// console.log(error.message)
				// console.log(error.response.data.error)
				weeklyFigStore.set({
					data: [],
					loading: false,
					error: true,
					message: error.message, //error.response.data.error,
					success: false,
					noData: true
				});
			}
		},

		delete: async (_id: string) => {
			try {
				const { data } = await serverInstance.post(`${baseURL}/delete`, { _id: _id });


				// Set loading to true when fetching
				weeklyFigStore.update((state) => ({ ...state, loading: true }));
				weeklyFigStore.set({
					data: data.data.data,
					loading: false,
					error: false,
					message: data.message,
					success: true,
					noData: data.data.data.length > 0 ? false : true
				});
			} catch (error: any) {
				// console.log(error.message)
				// console.log(error.response.data.error)
				weeklyFigStore.set({
					data: [],
					loading: false,
					error: true,
					message: error.message, //error.response.data.error,
					success: false,
					noData: true
				});
			}
		}
	};
};

export const uploadeWeeeklyFigStore = UploadeWeeeklyFigStore();
export { weeklyFigStore }; // Export the store with loading state
