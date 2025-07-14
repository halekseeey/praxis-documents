import { docsStore } from '$lib/stores/docs-store.svelte';
import { docsNavigation } from '$lib/components/doc-navigation.svelte';

export async function load() {
	await docsStore.initialize();
	await docsNavigation.generateNavigation();
	return {};
}
