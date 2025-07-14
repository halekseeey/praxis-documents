import { writable } from 'svelte/store';

// Create a writable store for sidebar state
export const sidebarStore = writable({
	isOpen: true,
	isMobile: false
});

// Helper functions to interact with the store
export const sidebarActions = {
	toggle: () => {
		sidebarStore.update((state) => ({
			...state,
			isOpen: !state.isOpen
		}));
	},

	open: () => {
		sidebarStore.update((state) => ({
			...state,
			isOpen: true
		}));
	},

	close: () => {
		sidebarStore.update((state) => ({
			...state,
			isOpen: false
		}));
	},

	setMobile: (isMobile: boolean) => {
		sidebarStore.update((state) => ({
			...state,
			isMobile
		}));
	},

	setOpen: (isOpen: boolean) => {
		sidebarStore.update((state) => ({
			...state,
			isOpen
		}));
	}
};

// Subscribe to store changes and sync with localStorage
if (typeof window !== 'undefined') {
	// Load initial state from localStorage
	const savedState = localStorage.getItem('sidebar-state');
	if (savedState) {
		try {
			const parsed = JSON.parse(savedState);
			sidebarStore.set(parsed);
		} catch (e) {
			console.warn('Failed to parse sidebar state from localStorage:', e);
		}
	}

	// Save state changes to localStorage
	sidebarStore.subscribe((state) => {
		localStorage.setItem('sidebar-state', JSON.stringify(state));
	});
}
