import type { UserResponse } from './types';

export const getSession = () => {
	let session;
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		session = localStorage.getItem('user');
		session = JSON.parse(session!)
	}
	return session;
};

export const setSession = (user: UserResponse) => {
	if (user) {
		localStorage.setItem('user', JSON.stringify(user));
		// axios.defaults.headers.common['Authorization'] = `Bearer ${user}`;
	} else {
		localStorage.removeItem('user');
		// delete axios.defaults.headers.common['Authorization'];
	}
};
