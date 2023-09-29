<script lang="ts">
	import type { ComponentType, SvelteComponent, ComponentEvents } from 'svelte';
	import axios from 'axios';
	import Chart from 'chart.js/auto';
	import PieChart from './PieChart.svelte';
	import SummaryTable from './SummaryTable.svelte';
	import BarChart from './BarChart.svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';

	import * as XLSX from 'xlsx/xlsx.mjs';
	import { uploadTradesStore, tradeStore } from '../../../store';

	export let ChartDataSet: any[] = [];
	let DemoChart: Chart;
	let PieChartData: any[] = [];
	let commodities: string[] = ['SSBS', 'SPRL', 'SCSN', 'SMAZ', 'SCSN'];
	let fileName: string;
	import SvelteTable from 'svelte-table';
	import CustomModal from '../common/CustomModal.svelte';
	import { Button } from 'flowbite-svelte';

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		await uploadTradesStore.getAll();
		let rowObject: any = 0;
		tradeStore.subscribe(($tradeStore) => (rowObject = $tradeStore));
		// console.log('handling data in chart dashboard');
		// console.log(rowObject);
		rowObject.sort((a: any, b: any) => a.DATE - b.DATE);
		// tradeStore.set({ ...rowObject });

		for (let i = 0; i < rowObject.length; i += 1) {
			const serialDate: any = rowObject[i].DATE;
			const daysSince1900: any = serialDate - 1; // Excel incorrectly considers 1900 as a leap year
			const millisecondsPerDay: any = 24 * 60 * 60 * 1000;
			const dateValue: any = new Date(Date.UTC(1900, 0, 1) + daysSince1900 * millisecondsPerDay);

			let momentDate = moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('MMM, YYYY');
			rowObject[i].DATE = momentDate;

			ChartDataSet[i] = { x: rowObject[i].DATE, y: rowObject[i].BALANCE };
			PieChartData[i] = {
				x: rowObject[i].DATE,
				y: rowObject[i].BALANCE,
				commodity: rowObject[i].COMMODITY
			};
		}

		// console.log(rowObject);
		rows = [...rowObject];

		// DemoChart.data.datasets[0].data = ChartDataSet;
		// DemoChart.update();

		if (ChartDataSet.length !== 0) {
			showModalData = true;
		}
		console.log(showModalData);

		return rowObject;
	}

	/** @type {import('svelte/action').Action}  */
	function HandleFile(node: HTMLElement) {
		const inputElement = document.getElementById('uploadInput') as HTMLInputElement;

		inputElement.addEventListener('change', handleFiles, false);
		function handleFiles(this: HTMLInputElement) {
			const fileList: any = this.files; /* now you can work with the file list */
			console.log(fileList);
			if (fileList.length > 0) {
				fileName = fileList[0].name; // Update the displayed file name
			}
			let fileReader = new FileReader();
			fileReader.readAsBinaryString(fileList[0]);
			fileReader.onload = (event: ProgressEvent<FileReader>) => {
				let data = event.target!.result as string;
				let workbook = XLSX.read(data, { type: 'binary' });
				console.log(workbook);
				workbook.SheetNames.forEach((sheet: string) => {
					let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);

					uploadTradesStore.upload(rowObject);
					rowObject = HandleData();

					console.log(rowObject);

					// DemoChart.data.datasets[0].data = ChartDataSet;
					// DemoChart.update();
					rows = [...rowObject];
				});
			};
		}

		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}

	/** @type {import('svelte/action').Action}  */
	function DisplayChart(node: HTMLElement) {
		const ctx = document.getElementById('acquisitions') as HTMLCanvasElement;

		DemoChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						data: ChartDataSet
					}
				]
			}
		});
		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}

	let rows: any[] = [
		{
			DATE: 'March 1, 2023 at 12:09 AM',
			DESCRIPTION:
				'Fees charged on total of 1 out of 100000(s) that m…m your SSBS Sell order. Order tid is 139179936121',
			DEBIT: 7.23,
			ORDER: 'SELL',
			COMMODITY: 'SSBS',
			BALANCE: 81019528.28
		},

		{
			DATE: 'March 1, 2023 at 12:09 AM',
			DESCRIPTION:
				'A total of 1 out of 100000(s) have matched from your SSBS Sell order. Order tid is 139179936121',
			CREDIT: 345,
			ORDER: 'SELL',
			COMMODITY: 'SSBS',
			BALANCE: 81019535.51
		}
	];
	let columns = [
		/** columns config (example below) */
		{
			key: 'date',
			title: 'DATE',
			value: (v: any) => v.DATE
		},
		{
			key: 'commodity',
			title: 'COMMODITY',
			value: (v: any) => v.COMMODITY
		},
		{
			key: 'order',
			title: 'ORDER',
			value: (v: any) => v.ORDER
		},
		{
			key: 'credit',
			title: 'CREDIT',
			value: (v: any) => (v.CREDIT == null ? 0 : v.CREDIT)
		},
		{
			key: 'debit',
			title: 'DEBIT',
			value: (v: any) => (v.DEBIT == null ? 0 : v.DEBIT)
		},
		{
			key: 'balance',
			title: 'BALANCE',
			value: (v: any) => v.BALANCE
		}
	];

	let modal = false;
	let showModalData = false;

	function openModal() {
		modal = true;
		// ChartDataSet = [];
	}

	function closeModal() {
		modal = false;
		showModalData = true;
	}
	// console.log(showModalData);
</script>

<main class="p-10 flex flex-col">
	<Button on:click={openModal} class="bg-orange-500 text-white w-40">Upload Data</Button>

	<CustomModal bind:open={modal} onClose={closeModal} title="Upload Your Trading Data">
		<div>
			<form name="uploadForm" class="flex w-full mb-3">
				<div class="relative bg-white w-full">
					<span class="block mb-3 font-bold">Upload a File</span>
					<input
						accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						id="uploadInput"
						use:HandleFile
						type="file"
						class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
					<label
						for="uploadInput"
						class="block p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
					>
						<span class="text-gray-700">{fileName ? fileName : 'Choose a file'}</span>
					</label>
				</div>
			</form>
		</div>
	</CustomModal>

	{#if ChartDataSet.length === 0 && !modal}
		<div class="text-center font-semibold text-gray-600">
			<p>No data</p>
			<p>Upload a document to see the Chart</p>
		</div>
	{/if}

	{#if ChartDataSet.length !== 0 || showModalData}
		{#if true}
			{#key ChartDataSet}
				<div class="flex flex-wrap justify-center">
					<!-- first row -->
					<div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 mb-5">
						<!-- First Chart (Assuming it's BarChart) -->
						<div class="mb-4 shadow-md px-5 py-2 rounded-md">
							<p class="text-center font-bold tracking-wider py-2 text-xl">Line Chart</p>
							<canvas id="acquisitions" use:DisplayChart />
						</div>
						<!-- Second Chart (Assuming it's PieChart) -->
						<div class="mb-4 shadow-md px-5 py-4 rounded-md">
							<p class="text-center font-bold tracking-wider py-2 text-xl">Pie Chart</p>
							<PieChart ChartDataSet={PieChartData} {commodities} />
						</div>
					</div>
					<div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 mb-5">
						<!-- Third Component (Assuming it's BarChart) -->
						<div class="mb-4 shadow-md px-5 py-4 rounded-md">
							<h1 class="text-center font-bold py-2 text-xl">Bar Chart</h1>
							<BarChart {ChartDataSet} />
						</div>
						<div style="margin:5px;">
							<SummaryTable {ChartDataSet} />
						</div>
					</div>
					<!-- <SvelteTable {columns} {rows} /> -->
				</div>
			{/key}
			{#key ChartDataSet}
				<div class="overflow-x-auto">
					<table class="min-w-full border-collapse border border-gray-300">
						<thead>
							<tr>
								{#each columns as column}
									<th class="bg-gray-200 p-2">{column.title}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each rows as row}
								<tr>
									{#each columns as column}
										<td class="border border-gray-300 p-2 {column.class}">{column.value(row)}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/key}

			<!-- {:else}
  <div class="text-center font-semibold text-gray-600">
	<p>No data</p>
	 <p>Upload a document to see the Chart</p>
  </div> -->
		{/if}
	{/if}
</main>

<style>
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>
