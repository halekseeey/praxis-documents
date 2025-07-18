<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Separator from '../ui/separator/separator.svelte';
	import DocContent from './doc-content.svelte';
	import DocHeader from './doc-header.svelte';
	import { getHighlighter } from '../../utils/highlighter-cache.js';
	import { mode } from 'mode-watcher';
	import TableOfContents from './table-of-contents.svelte';
	import MobileTableOfContents from './mobile-table-of-contents.svelte';

	let highlighter: any = $state();

	let { title, description, data }: { title: string; description: string; data: any } = $props();
	let theme = $derived($mode);
	let contentKey = $derived(`${theme}-${title}`);

	onMount(async () => {
		highlighter = await getHighlighter();
	});
</script>

{#if highlighter}
	<div class="relative flex flex-col gap-6 sm:flex-row">
		<div class="min-w-0 flex-1 overflow-hidden">
			<!-- <DocHeader {title} {description} /> -->

			{#key contentKey}
				<DocContent {highlighter} {theme} {data} />
			{/key}
		</div>
		<div>
			<div class=" sticky top-20 flex w-72 flex-col gap-4">
				<div class="sidebar hidden overflow-x-hidden sm:block">
					<TableOfContents />
					<!-- <Separator /> -->
				</div>
				<div class="block sm:hidden">
					<MobileTableOfContents />
				</div>
				<!-- <PromoCard /> -->
			</div>
		</div>
	</div>
{:else}
	<!-- Loading state while highlighter initializes -->
	<div class="w-[calc(100vw + 16rem)] relative flex flex-col gap-6 sm:flex-row">
		<div class="min-w-0 flex-1 overflow-hidden">
			<div class="animate-pulse">
				<div class="mb-4 h-8 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Code block wrapper styles */
	:global(.shiki-wrapper) {
		margin: 1.5em 0;
		padding: 1.25rem;
		border-radius: 0.5rem;
		width: 100%;
		max-width: calc(100vw - 3rem);
		overflow-x: auto;
		display: block;
		background-color: #f6f8fa;
		border: 1px solid #d0d7de;
	}

	:global(ol .shiki-wrapper) {
		max-width: calc(100vw - 5rem);
	}

	:global(.dark .shiki-wrapper) {
		background-color: #0d1117 !important;
		border-color: #30363d;
	}

	/* Code highlighting styles */
	:global(.shiki) {
		background-color: transparent !important;
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.9em;
		line-height: 1.5;
	}

	/* Pre and code styles */
	:global(.prose pre) {
		padding: 0.75rem !important;
		margin: 0;
		background-color: #f6f8fa !important;
	}

	:global(.prose :not(pre) > code) {
		background-color: rgb(175 184 193 / 20%);
		padding: 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-weight: 400;
		max-width: 100%;
	}

	:global(.dark .prose :not(pre) > code) {
		background-color: rgb(30 41 59);
	}

	/* Remove default code decorations */
	:global(.prose code::before),
	:global(.prose code::after) {
		content: '' !important;
	}

	/* Line hover effects */
	:global(.line:hover) {
		background-color: rgb(175 184 193 / 10%);
	}

	:global(.dark .line:hover) {
		background-color: #1f2937;
	}
</style>
