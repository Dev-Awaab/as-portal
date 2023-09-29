export interface UserResponse {
	name: string;
	email: string;
	password: string;
	access_token: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginValues {
	email: string;
	password: string;
}

export interface RegisterValues {
	name: string;
	email: string;
	password: string;
}
