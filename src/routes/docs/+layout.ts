import { docsStore } from '$lib/stores/docs-store.svelte';
import { docsNavigation } from '$lib/components/doc-navigation.svelte';
import { getHighlighter } from '$lib/utils/highlighter-cache.js';

export async function load() {
	// First initialize docs store, then navigation, and highlighter in parallel
	await docsStore.initialize();

	const [navInit, highlighterInit] = await Promise.all([
		docsNavigation.generateNavigation(),
		getHighlighter() // Pre-initialize highlighter
	]);

	return {};
}
