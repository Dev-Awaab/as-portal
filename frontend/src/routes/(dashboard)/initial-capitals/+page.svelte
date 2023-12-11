<script>
	import InitialBalanceForm from '$lib/components/chart/BalanceSummary/InitialBalanceForm.svelte';
	import AuthGuard from '$lib/components/common/AuthGuard.svelte';
	import Sidebar from '$lib/components/common/Sidebar.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>


	<InitialBalanceForm />

