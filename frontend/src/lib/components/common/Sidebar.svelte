<script>
	import { goto } from '$app/navigation';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Secondary } from 'flowbite-svelte';
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
		LifeBuoySolid,
		CalendarWeekSolid
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';

	function GoToDashbaord() {
		window.location.assign('/');
	}
	function GoToPerformace() {
		window.location.assign('/performace');
	}
	function GoToBrokerage() {
		window.location.assign('/borkerage-income');
	}

	let open = false;

	const toggle = () => {
		open = !open;
	};

	console.log(open);
</script>

<main class="hidden h-screen md:flex">
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
				<SidebarItem label="Inventory" href="/inventory" class="py-5 px-3">
					<svelte:fragment slot="icon">
						<ChartPieSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<!-- <SidebarItem label="Portfolio Performace" href="/performace" class="py-5 px-3">
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
				</SidebarItem> -->
				<SidebarItem label="Weekly Figures" href="/weekly-figures" class="py-5 px-3">
					<svelte:fragment slot="icon">
						<CalendarWeekSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</main>
