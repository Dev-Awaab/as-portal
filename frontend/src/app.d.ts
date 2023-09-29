// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export interface SignUpValues {
	name: string;
	email: string;
	password: string;
}

export interface SignInValues {
	email: string;
	password: string;
}

export {};
