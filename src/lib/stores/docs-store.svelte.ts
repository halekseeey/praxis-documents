import type { DocResolver } from '$lib/types/docs';

interface DocItem {
	title: string;
	slug: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
}

class DocsStore {
	private static instance: DocsStore;
	public documents = $state<DocItem[]>([]);
	public isInitialized = $state<boolean>(false);

	private constructor() {}

	public static getInstance(): DocsStore {
		if (!DocsStore.instance) {
			DocsStore.instance = new DocsStore();
		}
		return DocsStore.instance;
	}

	public async initialize(): Promise<void> {
		if (this.isInitialized) return;

		console.log('Initializing docs store...');
		const modules = import.meta.glob(`/src/content/**/*.md`);
		console.log('Found modules:', Object.keys(modules).length);

		// Process all files in parallel instead of sequentially
		const docPromises = Object.entries(modules).map(async ([path, resolver]) => {
			try {
				const doc = await (resolver as DocResolver)();

				// Extract href and slug from path
				let href = `/docs${path.replace(/^\/src\/content/, '').replace(/\.md$/, '')}`;
				href = href.replace(/\/index$/, '');
				let slug = path.replace(/^\/src\/content/, '').replace(/\.md$/, '');
				slug = slug.replace(/\/index$/, '');

				// Extract title and metadata
				let title = '';
				let disabled = false;
				let external = false;
				let label = '';

				if (doc?.metadata?.title) {
					title = doc.metadata.title;
					disabled = doc.metadata.disabled || false;
					external = doc.metadata.external || false;
					label = doc.metadata.label || '';
				} else {
					// Extract title from filename as fallback
					const filename = path.split('/').pop()?.replace('.md', '') || '';
					title = filename.charAt(0).toUpperCase() + filename.slice(1).replace(/[-_]/g, ' ');
				}

				if (title) {
					return {
						title,
						slug,
						href,
						disabled,
						external,
						label
					};
				}
			} catch (e) {
				console.error(`Error processing ${path}:`, e);
			}
			return null;
		});

		// Wait for all promises to resolve and filter out null results
		const results = await Promise.all(docPromises);
		const docs = results.filter((doc): doc is NonNullable<typeof doc> => doc !== null);

		console.log('Processed docs:', docs.length);
		this.documents = docs;
		this.isInitialized = true;
		console.log('Docs store initialized');
	}

	public getDocuments(): DocItem[] {
		return this.documents;
	}

	public getDocumentsForSearch(): { title: string; slug: string }[] {
		return this.documents.map((doc) => ({
			title: doc.title,
			slug: doc.slug
		}));
	}

	public getDocumentsForNavigation(): DocItem[] {
		return this.documents;
	}
}

export const docsStore = DocsStore.getInstance();
