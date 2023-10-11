<script>
	import ChartDashboard from '$lib/components/chart/ChartDashboard.svelte';
	import Bar2Chart from '$lib/components/dashboard/Bar2Chart.svelte';
	import DoughnutChart from '$lib/components/dashboard/DoughnutChart.svelte';
	import LineChart from '$lib/components/dashboard/LineChart.svelte';
	import Pie2Chart from '$lib/components/dashboard/Pie2Chart.svelte';
	import { Button } from 'flowbite-svelte';
	import { DownloadOutline, UploadOutline } from 'flowbite-svelte-icons';
</script>

<!-- <ChartDashboard /> -->

<main>
	<section class="p-5 space-x-10">
		<Button class="bg-blue-500 w-40 py-5">
			<UploadOutline class="w-8 h-w-8  mr-2" />
			Upload Data</Button
		>

		<Button class="bg-blue-500 w-40 py-5">
			<DownloadOutline class="w-8 h-w-8 mr-2 " /> Sample
		</Button>
		<Button class="bg-blue-500 w-40 py-5">
			<DownloadOutline class="w-8 h-w-8 mr-2 " /> Template
		</Button>
	</section>
	<section class="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
		<div class="bg-white rounded shadow">
			<h2
				class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
			>
				Transaction Volume
			</h2>
			<div class="p-4">
				<LineChart />
			</div>
		</div>
		<div class="bg-white rounded shadow">
			<h2
				class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
			>
				Monthly Brokerage Income
			</h2>
			<div class="p-4">
				<Bar2Chart />
			</div>
		</div>
		<div class="bg-white rounded shadow">
			<h2
				class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
			>
				Inventory
			</h2>
			<div class="p-4">
				<DoughnutChart />
			</div>
		</div>

		<div class="bg-white rounded shadow">
			<h2
				class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
			>
				Portfolio Value
			</h2>
			<div class="p-4">
				<Pie2Chart />
			</div>
		</div>
	</section>
</main>
