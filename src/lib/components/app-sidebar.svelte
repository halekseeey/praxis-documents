<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { siteConfig } from '$lib/config';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import type { ComponentProps } from 'svelte';
	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	import { docsNavigation } from '$lib/components/doc-navigation.svelte';
	import { page } from '$app/state';
	import SocialMedia from './social-media.svelte';
	import SidebarRecursiveMenu from './sidebar-recursive-menu.svelte';
	const path = $derived(page.url.pathname);
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<GalleryVerticalEnd class="size-4" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-semibold"> {siteConfig.title} </span>
								<span class="">{siteConfig.version}</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			{#if docsNavigation.docNav.length > 0}
				<SidebarRecursiveMenu items={docsNavigation.docNav} />
			{:else}
				<!-- Loading state for navigation -->
				<div class="px-3 py-2">
					<div class="space-y-2">
						<div class="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
						<div class="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
						<div class="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
				</div>
			{/if}
		</Sidebar.Group>
	</Sidebar.Content>
	<div class="block sm:hidden">
		<Sidebar.Footer>
			<SocialMedia />
		</Sidebar.Footer>
	</div>

	<Sidebar.Rail />
</Sidebar.Root>
