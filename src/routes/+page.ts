import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';
import type { DocFile } from '$lib/types/docs.js';

export const load: PageLoad = async () => {
	// @ts-expect-error import doesn't recognize *.md modules _yet_
	const doc: DocFile = await import('../content/Home.md');

	if (!doc || !doc.metadata) {
		redirect(302, '/');
	}
	return {
		doc: doc.default,
		metadata: doc.metadata
	};
};
