import { docsStore } from '$lib/stores/docs-store.svelte';

interface SearchResult {
	title: string;
	slug: string;
}

class DocsSearch {
	private static instance: DocsSearch;
	public searchResults = $state<SearchResult[]>([]);
	public isSearching = $state<boolean>(false);

	private constructor() {}

	public static getInstance(): DocsSearch {
		if (!DocsSearch.instance) {
			DocsSearch.instance = new DocsSearch();
		}
		return DocsSearch.instance;
	}

	public async search(query: string): Promise<void> {
		const trimmedQuery = query.trim();

		if (!trimmedQuery || trimmedQuery.length < 1) {
			this.searchResults = [];
			this.isSearching = false;
			return;
		}

		this.isSearching = true;

		try {
			// Initialize docs store if not already done
			await docsStore.initialize();

			const searchTerm = trimmedQuery.toLowerCase();
			console.log('Searching for term:', `"${searchTerm}"`);

			const formattedResults: SearchResult[] = [];
			const documents = docsStore.getDocumentsForSearch();

			for (const document of documents) {
				const title = document.title.toLowerCase();
				if (searchTerm && title.includes(searchTerm)) {
					formattedResults.push({
						title: document.title,
						slug: document.slug
					});
				}
			}

			// Simple sort by position of match
			formattedResults.sort((a, b) => {
				const aTitle = a.title.toLowerCase();
				const bTitle = b.title.toLowerCase();

				const aIndex = aTitle.indexOf(searchTerm);
				const bIndex = bTitle.indexOf(searchTerm);

				if (aIndex !== bIndex) return aIndex - bIndex;
				return aTitle.localeCompare(bTitle);
			});

			// Update results in a single assignment to trigger reactivity
			this.searchResults = formattedResults.slice(0, 10);
			console.log('Search results:', this.searchResults.length, 'items');
		} catch (error) {
			console.error('Search error:', error);
			this.searchResults = [];
		} finally {
			this.isSearching = false;
		}
	}

	public async initializeSearchIndex(): Promise<void> {
		// Initialize docs store if not already done
		await docsStore.initialize();
	}

	public clearSearch(): void {
		this.searchResults = [];
		this.isSearching = false;
	}
}

export const docsSearch = DocsSearch.getInstance();
