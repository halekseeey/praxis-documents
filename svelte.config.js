import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess({}),
		mdsvex({
			extensions: ['.md', '.svx'],
			smartypants: {
				dashes: 'oldschool'
			},
			remarkPlugins: [
				// Escaping < and >
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'text' && /[<>]/.test(node.value)) {
							node.value = node.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				},
				// Escaping curly braces { and }
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'text' && /[{}]/.test(node.value)) {
							node.value = node.value.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				},
				// Fix image paths
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'image' && node.url) {
							// Handle both 'images/' and './images/' paths
							if (node.url.startsWith('images/')) {
								node.url = `/${node.url}`;
							} else if (node.url.startsWith('./images/')) {
								node.url = `/${node.url.substring(2)}`;
							}
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				},
				// Link processing - adding docs prefix
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'link' && node.url) {
							// Skip external links (http, https, mailto, etc.)
							if (
								node.url.startsWith('http') ||
								node.url.startsWith('mailto:') ||
								node.url.startsWith('tel:') ||
								node.url.startsWith('#')
							) {
								return;
							}

							// Handle image paths in links (for static assets)
							if (node.url.startsWith('images/')) {
								node.url = `/${node.url}`;
								return;
							} else if (node.url.startsWith('./images/')) {
								node.url = `/${node.url.substring(2)}`;
								return;
							}

							// Handle relative and absolute links within the project
							if (node.url.startsWith('/')) {
								// Absolute path - add docs prefix without double slash
								node.url = `/docs/${node.url}`;
							} else if (
								!node.url.startsWith('http') &&
								!node.url.startsWith('mailto:') &&
								!node.url.startsWith('tel:') &&
								!node.url.startsWith('#')
							) {
								// Relative path - add docs prefix
								// For relative paths, we need to handle them based on the current file context
								// This will be handled by the frontend routing logic
								node.url = `${node.url}`;
							}

							// Remove trailing slash if present
							if (node.url.endsWith('/') && node.url !== '/docs/') {
								node.url = node.url.slice(0, -1);
							}

							// Remove .md extension if present
							if (node.url.endsWith('.md')) {
								node.url = node.url.slice(0, -3);
							}
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				}
			]
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
