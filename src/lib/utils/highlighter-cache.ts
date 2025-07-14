import { createHighlighter } from 'shiki/bundle/web';

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
		langs: [
			'typescript',
			'javascript',
			'bash',
			'markdown',
			'json',
			'html',
			'css',
			'svelte',
			'shell',
			'tsx',
			'python'
		]
	});

	globalHighlighter = await highlighterPromise;
	return globalHighlighter;
}

export function clearHighlighterCache() {
	globalHighlighter = null;
	highlighterPromise = null;
}
