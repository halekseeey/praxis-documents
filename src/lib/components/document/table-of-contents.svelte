<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import { TableOfContents } from './toc.svelte.js';

	import { ChevronRight } from 'lucide-svelte';
	let toc = $state(TableOfContents.getInstance());
</script>

<div>
	<h5
		id="docs-on-this-page-sidebar-label"
		class="mb-3 text-sm font-semibold text-gray-800 dark:text-neutral-300"
	>
		On this page
	</h5>
	<ul>
		{#each toc.headings as heading}
			<li>
				<Button
					variant="link"
					href="#{heading.id}"
					class="font-base w-full !whitespace-normal text-sm text-gray-800 dark:text-neutral-300"
				>
					{#if heading.level > 1}
						<ChevronRight
							style="margin-left: {(heading.level - 1) * 1}rem"
							class="mt-[5px] size-3.5 shrink-0"
						/>
					{/if}
					<div class="min-w-0 flex-1 overflow-hidden truncate text-ellipsis">
						{heading.text}
					</div>
				</Button>
			</li>
		{/each}
	</ul>
</div>
