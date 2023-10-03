<script lang="ts">
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Secondary } from 'flowbite-svelte';
	import { userStore } from '../../../utils';
	import { goto } from '$app/navigation';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		BagSolid,
		ArrowRightToBracketSolid,
		FileEditSolid,
		FireSolid,
		BookSolid,
		WindowRestoreOutline,
		LifeBuoySolid
	} from 'flowbite-svelte-icons';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	$: activeUrl = $page.url.pathname;

	let user = $userStore;

	function logout() {
		// Remove the user data from local storage
		localStorage.removeItem('user');

		// Clear the user data in the userStore
		userStore.set(null);

		// Redirect to the /sign-in page
		window.location.assign('/sign-in');
	}
</script>

<Navbar let:hidden let:toggle class="shadow">
	<NavBrand href="/">
		<img src="/logo.png" class="mr-3 h-20" alt="Flowbite Logo" />
		<!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-orange-500">Marble</span> -->
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {activeUrl} {hidden}>
		{#if user}
			<div class="space-x-5">
				<Secondary color="text-lg "
					>Welcome,
					<span class="uppercase"> {user?.name}</span>
				</Secondary>
				<Button on:click={logout} class="bg-red-500 outline-none focus:ring-0">Logout</Button>
			</div>
			<!-- 
			{#if !hidden}
				<main {hidden} class="h-screen flex">
					<Sidebar id="default-sidebar" class="h-screen">
						<SidebarWrapper class=" h-screen">
							<SidebarGroup class=" space-y-10">
								<SidebarItem label="Dashboard" href="/" class="py-5 px-3">
									<svelte:fragment slot="icon">
										<ChartPieSolid
											class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem label="Portfolio Performace" href="/performace" class="py-5 px-3">
									<svelte:fragment slot="icon">
										<GridSolid
											class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem label="Brokerage Income" href="/brokerage-income" class="py-5 px-3">
									<svelte:fragment slot="icon">
										<MailBoxSolid
											class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem label="Portfolio Values" href="/initial-capital" class="py-5 px-3">
									<svelte:fragment slot="icon">
										<UserSolid
											class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
							</SidebarGroup>
						</SidebarWrapper>
					</Sidebar>
				</main>
			{/if} -->
		{:else}
			<NavLi
				href="/sign-in"
				class="text-green-500 text-base "
				activeClass="text-red-500 hover:text-green-800">Sign In</NavLi
			>
			<NavLi
				href="/sign-up"
				class="text-green-500 text-base "
				activeClass="text-red-500 hover:text-green-800">Sign Up</NavLi
			>
		{/if}
	</NavUl>
</Navbar>
