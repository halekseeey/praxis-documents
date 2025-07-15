<script lang="ts">
	import { onMount } from 'svelte';
	import { TableOfContents } from './toc.svelte.js';
	import { supportedCodeLanguages } from '$lib/config';

	let contentRef: HTMLElement | undefined = $state();
	let { highlighter, theme, data }: { highlighter: any; theme: string | undefined; data: any } =
		$props();

	let toc = $state(TableOfContents.getInstance());

	async function highlightCode() {
		if (!contentRef || !highlighter) return;

		const codeBlocks = contentRef.querySelectorAll('pre code');
		const blocksToHighlight = Array.from(codeBlocks).filter(
			(block) => !block.closest('pre')?.classList.contains('shiki')
		);

		if (blocksToHighlight.length === 0) return;

		// Process all code blocks in parallel
		const highlightPromises = blocksToHighlight.map(async (block) => {
			const code = block.textContent || '';
			let language = block.getAttribute('class')?.replace('language-', '') || 'plaintext';

			// Normalize language names
			if (['python3', 'py'].includes(language)) {
				language = 'python';
			}

			// Список поддерживаемых языков теперь берём из config.ts
			if (!supportedCodeLanguages.includes(language)) {
				language = 'plaintext';
			}

			try {
				const highlightedCode = await highlighter.codeToHtml(code, {
					lang: language,
					theme: theme === 'dark' ? 'github-dark' : 'github-light'
				});

				const wrapper = block.closest('pre');
				if (wrapper) {
					// Extract the inner content of the highlighted code (inside the pre tag)
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = highlightedCode;
					const innerContent = tempDiv.querySelector('.shiki')?.innerHTML || '';

					// Keep the original pre tag but update its classes and content
					wrapper.className = 'shiki shiki-wrapper not-prose';
					wrapper.style.backgroundColor = theme === 'github-dark' ? '#0d1117' : '#f6f8fa';
					wrapper.innerHTML = innerContent;
				}
			} catch (error) {
				console.warn(`Failed to highlight code block with language '${language}':`, error);
				// Fallback to plain text highlighting
				const wrapper = block.closest('pre');
				if (wrapper) {
					wrapper.className = 'shiki-wrapper not-prose';
					wrapper.style.backgroundColor = theme === 'github-dark' ? '#0d1117' : '#f6f8fa';
				}
			}
		});

		// Wait for all highlighting to complete
		await Promise.all(highlightPromises);
	}
	onMount(() => {
		if (contentRef) {
			toc.updateContentRef(contentRef);
			// Small delay to ensure content is fully rendered
			setTimeout(() => {
				highlightCode();
			}, 0);
		}
	});
</script>

<div class="prose prose-slate dark:prose-invert max-w-none" bind:this={contentRef}>
	<data.doc />
</div>
