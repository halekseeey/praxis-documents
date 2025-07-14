import adapter from '@sveltejs/adapter-cloudflare';
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
				// Экранирование < и >
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'text' && /[<>]/.test(node.value)) {
							node.value = node.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				},
				// Экранирование фигурных скобок { и }
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'text' && /[{}]/.test(node.value)) {
							node.value = node.value.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
						}
						if (node.children) node.children.forEach(visit);
					};
					visit(tree);
				},
				// Исправление путей к изображениям
				() => (tree) => {
					const visit = (node) => {
						if (node.type === 'image' && node.url && node.url.startsWith('images/')) {
							node.url = `/images/${node.url}`;
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
