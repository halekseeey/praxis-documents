import { createHighlighter } from 'shiki/bundle/web';
import { supportedCodeLanguages } from '$lib/config';

let globalHighlighter: any = null;
let highlighterPromise: Promise<any> | null = null;

export async function getHighlighter() {
	if (globalHighlighter) {
		return globalHighlighter;
	}

	if (highlighterPromise) {
		return highlighterPromise;
	}

	highlighterPromise = createHighlighter({
		themes: ['github-dark', 'github-light'],
		langs: supportedCodeLanguages
	});

	globalHighlighter = await highlighterPromise;
	return globalHighlighter;
}

export function clearHighlighterCache() {
	globalHighlighter = null;
	highlighterPromise = null;
}
