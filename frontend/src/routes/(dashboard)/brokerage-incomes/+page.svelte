<script>
	import ChartDashboard from '$lib/components/chart/ChartDashboard.svelte';
	import BalanceDashboard from '$lib/components/chart/BalanceSummary/BalanceDashboard.svelte';
	import InitialBalanceForm from '$lib/components/chart/BalanceSummary/InitialBalanceForm.svelte';
	import BrokrageIncome from '$lib/components/chart/BalanceSummary/BrokrageIncome.svelte';
	import AuthGuard from '$lib/components/common/AuthGuard.svelte';
	import Sidebar from '$lib/components/common/Sidebar.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>


	<BrokrageIncome />

