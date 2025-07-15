<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import DarkModeToggle from '$lib/components/dark-mode-toggle.svelte';
	import SearchBar from '$lib/components/search-bar.svelte';
	import SocialMedia from '$lib/components/social-media.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { sidebarStore, sidebarActions } from '$lib/hooks/sidebar-store.svelte.js';
	import { onMount } from 'svelte';

	let { children }: { children: any } = $props();

	let sidebarState = $derived($sidebarStore);

	let withTransition = $state(false);

	onMount(() => {
		const checkMobile = () => {
			const isMobile = window.innerWidth < 768;
			sidebarActions.setMobile(isMobile);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<Toaster />
<ModeWatcher />
<div class="h-dvh">
	<Sidebar.Provider
		bind:open={sidebarState.isOpen}
		onOpenChange={(isOpen) => {
			withTransition = true;

			sidebarActions.setOpen(isOpen);

			setTimeout(() => {
				withTransition = false;
			}, 0);
		}}
	>
		<AppSidebar />
		<Sidebar.Inset>
			<header
				class="bg-background sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b px-4"
			>
				<div class="flex h-16 items-center gap-2">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<Breadcrumb />
				</div>

				<div class="flex items-center gap-2">
					<SearchBar />
					<div class="hidden sm:block">
						<SocialMedia />
					</div>
					<DarkModeToggle />
				</div>
			</header>
			<div
				class="content-container flex flex-col gap-4 p-4 ease-linear"
				class:duration-200={withTransition}
				class:transition-all={withTransition}
				style="--sidebar-open: {sidebarState.isOpen ? '1' : '0'}"
			>
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>

<style>
	.content-container {
		max-width: 100vw;
	}

	@media (min-width: 768px) {
		.content-container {
			max-width: calc(100vw - (16rem * var(--sidebar-open, 0)));
		}
	}
</style>
