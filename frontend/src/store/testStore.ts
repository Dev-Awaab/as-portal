// stores/api.js
import { writable } from 'svelte/store';

// Initialize a store
export const dataStore = writable([]);

// Function to fetch data from the API
export async function fetchData() {
	try {
		const response = await fetch(
			'https://trade-accounting-demo.onrender.com/api/weeklyfigures/retrive'
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const res = await response.json();
		dataStore.set(res.data.data.data);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}
