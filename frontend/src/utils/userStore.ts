// userStore.ts

import { storable } from '../store/storable';

interface UserData {
	name: string;
	email: string;
	// Add other properties as needed
}

export const userStore = storable<any>('user', () => {
	// Retrieve user data from local storage when the store is created
	const userDataString = localStorage.getItem('user');
	if (userDataString) {
		return JSON.parse(userDataString);
	}

	// If user data is not found in local storage, return an empty user object
	return {
		name: '',
		email: ''
	};
});
