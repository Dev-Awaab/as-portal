import { writable, type Writable } from 'svelte/store';

export function storable<T>(key: string, initialValue: T): Writable<T> {
	// Check if localStorage is defined (browser environment)
	const isBrowser = typeof window !== 'undefined';

	const storedValue = isBrowser ? localStorage.getItem(key) : null;

	let initialData: T;

	try {
		initialData = storedValue ? JSON.parse(storedValue) : initialValue;
	} catch (e) {
		initialData = initialValue;
	}

	const store: Writable<T> = writable<T>(initialData);

	store.subscribe(($storeValue: T) => {
		// Only use localStorage if it's defined (browser environment)
		if (isBrowser) {
			localStorage.setItem(key, JSON.stringify($storeValue));
		}
	});

	return store;
}
