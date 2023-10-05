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

// export const uploadeWeeeklyFigStore = UploadeWeeeklyFigStore();
import { writable } from 'svelte/store';
import axios from 'axios';

const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/weeklyfigures';

// Create a store with loading state
const weeklyFigStore = writable({
	data: [],
	loading: false
});

const UploadeWeeeklyFigStore = () => {
	return {
		get: async () => {
			try {
				// Set loading to true when fetching
				weeklyFigStore.update((state) => ({ ...state, loading: true }));
				const { data } = await axios.get(`${baseURL}/retrive`);
				weeklyFigStore.set({
					data: data.data.data,
					loading: false // Set loading to false when data is fetched
				});
			} catch (error: any) {
				weeklyFigStore.set({
					data: [],
					loading: false // Set loading to false on error
				});
			}
		}
	};
};

export const uploadeWeeeklyFigStore = UploadeWeeeklyFigStore();
export { weeklyFigStore }; // Export the store with loading state
