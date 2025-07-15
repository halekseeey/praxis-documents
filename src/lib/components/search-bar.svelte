<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { docsSearch } from './doc-search.svelte';
	import * as Command from '$lib/components/ui/command';
	import { Search as SearchIcon, BookOpen, FileText } from 'lucide-svelte';

	let open = $state(false);
	let searchQuery = $state('');
	let searchResults = $derived(docsSearch.searchResults);
	let isSearching = $derived(docsSearch.isSearching);

	$effect(() => {
		if (searchQuery) {
			docsSearch.search(searchQuery);
		} else {
			docsSearch.clearSearch();
		}
	});

	function handleResultClick(slug: string) {
		searchQuery = '';
		open = false;
		docsSearch.clearSearch();

		goto(`${slug}`);
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function handleSearchClick() {
		open = true;
		searchQuery = '';
		docsSearch.clearSearch();
	}
</script>

<button
	class="flex items-center gap-2 transition-opacity hover:opacity-80"
	onclick={handleSearchClick}
>
	<div class="flex items-center gap-2">
		<SearchIcon class="text-muted-foreground h-4 w-4" />
		<p class="text-muted-foreground hidden text-sm sm:block">Search documentation</p>
		<kbd
			class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
		>
			<span class="text-xs">⌘</span>K
		</kbd>
	</div>
</button>

<Command.Dialog bind:open>
	<div class="relative">
		<Command.Input bind:value={searchQuery} placeholder="Search documentation..." class="pl-10" />
	</div>

	<Command.List>
		{#if searchQuery === ''}
			<Command.Empty class="py-6 text-center text-sm">
				Start typing to search documentation...
			</Command.Empty>
		{:else if isSearching}
			<Command.Empty class="py-6 text-center text-sm">Searching...</Command.Empty>
		{:else if docsSearch.searchResults.length === 0}
			<Command.Empty class="py-6 text-center text-sm"></Command.Empty>
		{:else if docsSearch.searchResults.length > 0}
			<Command.Group heading="Documentation">
				{#each docsSearch.searchResults as result}
					<Command.Item
						onSelect={() => handleResultClick(result.slug)}
						class="flex items-start gap-2 px-2 py-3"
					>
						<FileText class="mt-0.5 h-4 w-4 shrink-0" />
						<div class="flex flex-col gap-1">
							<span class="font-medium">{result.title}</span>
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}

		{#if searchQuery === '' || searchResults.length > 0}
			<Command.Group heading="Quick Links">
				<Command.Item onSelect={() => handleResultClick('/SUMMARY')}>
					<BookOpen class="mr-2 h-4 w-4" />
					<span>Browse All Documentation</span>
				</Command.Item>
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
