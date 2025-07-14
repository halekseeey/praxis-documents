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
						<Collapsible.Trigger
							class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex min-h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium outline-none transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
						>
							<Folder class="size-4" />
							<span>{item.title}</span>
							<ChevronRight
								class="ml-auto size-3 transition-transform data-[state=open]:rotate-90"
							/>
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
					<Collapsible.Trigger
						class="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-fit min-h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:hidden [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
					>
						<Folder class="size-4" />
						<span>{item.title}</span>
						<ChevronRight class="ml-auto size-3 transition-transform data-[state=open]:rotate-90" />
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
