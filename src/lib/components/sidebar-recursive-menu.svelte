<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import type { NavItem } from '$lib/types/nav';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { ChevronRight, Folder } from 'lucide-svelte';
	import SidebarRecursiveMenu from './sidebar-recursive-menu.svelte'; // For recursion

	const { items = [], level = 0 }: { items?: NavItem[]; level?: number } = $props();
	const path = $derived(page.url.pathname);
</script>

{#if level === 0}
	<Sidebar.Menu>
		{#each items as item (item.href ?? item.title)}
			{#if item.items?.length}
				<Collapsible.Root>
					<Sidebar.MenuItem>
						<Collapsible.Trigger>
							<Sidebar.MenuButton class="flex items-center gap-2 font-medium">
								<Folder class="size-4" />
								<span>{item.title}</span>
								<ChevronRight
									class="ml-auto size-3 transition-transform data-[state=open]:rotate-90"
								/>
							</Sidebar.MenuButton>
						</Collapsible.Trigger>
					</Sidebar.MenuItem>
					<Collapsible.Content>
						<Sidebar.MenuSub>
							<SidebarRecursiveMenu items={item.items} level={level + 1} />
						</Sidebar.MenuSub>
					</Collapsible.Content>
				</Collapsible.Root>
			{:else}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class="font-medium" isActive={path === item.href}>
						{#snippet child({ props })}
							<a href={item.href} {...props}>{item.title}</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/if}
		{/each}
	</Sidebar.Menu>
{:else}
	{#each items as item (item.href ?? item.title)}
		{#if item.items?.length}
			<Collapsible.Root>
				<Sidebar.MenuSubItem>
					<Collapsible.Trigger>
						<Sidebar.MenuSubButton class="flex items-center gap-2">
							<Folder class="size-4" />
							<span>{item.title}</span>
							<ChevronRight
								class="ml-auto size-3 transition-transform data-[state=open]:rotate-90"
							/>
						</Sidebar.MenuSubButton>
					</Collapsible.Trigger>
				</Sidebar.MenuSubItem>
				<Collapsible.Content>
					<Sidebar.MenuSub>
						<SidebarRecursiveMenu items={item.items} level={level + 1} />
					</Sidebar.MenuSub>
				</Collapsible.Content>
			</Collapsible.Root>
		{:else}
			<Sidebar.MenuSubItem>
				<Sidebar.MenuSubButton isActive={path === item.href}>
					{#snippet child({ props })}
						<a href={item.href} {...props}>{item.title}</a>
					{/snippet}
				</Sidebar.MenuSubButton>
			</Sidebar.MenuSubItem>
		{/if}
	{/each}
{/if}
