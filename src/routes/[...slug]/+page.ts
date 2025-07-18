import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';
import type { DocFile } from '$lib/types/docs.js';
import { getDoc } from '$lib/utils.js';

export const load: PageLoad = async (event) => {
	const doc: DocFile = await getDoc(event.params.slug);
	if (!doc) {
		redirect(302, '/');
	}
	return {
		doc: doc.default,
		metadata: doc.metadata
	};
};
