<script lang="ts">
	import type { ComponentType, SvelteComponent, ComponentEvents } from 'svelte';
	import axios from 'axios';
	import Chart from 'chart.js/auto';
	import moment from 'moment';
	import { onMount } from 'svelte';

	import { createPerformaceStore, performaceStore } from '../../../../store/performaceStore';
	import * as XLSX from 'xlsx/xlsx.mjs';

	export let ChartDataSet: any[] = [];
	let DemoChart: Chart;
	let fileName: string;

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		createPerformaceStore.getPerformaceData();

		let rowObject: any = rows;
		performaceStore.subscribe(($performaceStore) => (rowObject = $performaceStore));
		// console.log(rowObject);
		rowObject.sort((a: any, b: any) => a.DATE - b.DATE);

		for (let i = 0; i < rowObject.length; i += 1) {
			const serialDate: any = rowObject[i].DATE;
			const daysSince1900: any = serialDate - 1; // Excel incorrectly considers 1900 as a leap year
			const millisecondsPerDay: any = 24 * 60 * 60 * 1000;
			const dateValue: any = new Date(Date.UTC(1900, 0, 1) + daysSince1900 * millisecondsPerDay);

			let momentDate = moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('MMM, YYYY');
			rowObject[i].DATE = momentDate;

			ChartDataSet[i] = { x: rowObject[i].DATE, y: rowObject[i].PERCENTRETURN };
		}

		rows = [...rowObject];
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

					for (let i = 0; i < rowObject.length; i += 1) {
						rowObject[i].BALANCE = rowObject[i].INLEIN + rowObject[i].AVAILABLECASHBALANCE;

						let netIncome = rowObject[i].BALANCE - initalBalance;
						let ROI = (netIncome / initalBalance) * 100;
						rowObject[i].PERCENTRETURN = ROI;
					}

					createPerformaceStore.sendData(rowObject);
					HandleData();
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

	// console.log(ChartDataSet.length);
	let initalBalance = 41019528.28;
	let rows: any[] = [
		{
			DATE: 44900,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 51019528.28
		},
		{
			DATE: 44930,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 31019528.28
		},
		{
			DATE: 44960,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 41019528.28
		},
		{
			DATE: 44990,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 51019528.28
		},
		{
			DATE: 45020,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 81019528.28
		},
		{
			DATE: 45050,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 71019528.28
		},
		{
			DATE: 45080,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 61019528.28
		},

		{
			DATE: 46020,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 5019528.28
		},

		{
			DATE: 46050,
			INLEIN: 3342225,
			AVAILABLECASHBALANCE: 81019528.28
		},

		{
			DATE: 46090,
			INLEIN: 16342225,
			AVAILABLECASHBALANCE: 9019528.28
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
			key: 'inlein',
			title: 'INLEIN',
			value: (v: any) => v.INLEIN
		},
		{
			key: 'availablecashbalance',
			title: 'AVAILABLE CASH BALANCE',
			value: (v: any) => v.AVAILABLECASHBALANCE
		},
		{
			key: 'balance',
			title: 'BALANCE',
			value: (v: any) => v.BALANCE
		},
		{
			key: 'percentgain',
			title: 'PERCENT GAIN (%)',
			value: (v: any) => Number(v.PERCENTRETURN).toFixed(2)
		}
	];
</script>

<main class="p-10 flex flex-col">
	<form name="uploadForm" class="flex w-full mb-3">
		<div class="relative bg-white w-full shadow rounded-lg p-2">
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
	<!-- <span id="fileName" class="text-gray-500 text-center mt-2">No file chosen</span> -->

	{#if ChartDataSet.length !== 0}
		{#key ChartDataSet}
			<div class="flex flex-wrap justify-center">
				<!-- first row -->
				<div class="w-full">
					<!-- First Chart (Assuming it's BarChart) -->
					<div class="mb-4 shadow-md px-5 py-2 rounded-md">
						<p class="text-center font-bold tracking-wider py-2 text-xl">Line Chart</p>
						<canvas id="acquisitions" use:DisplayChart />
					</div>
				</div>
				<!-- Third Component (Assuming it's BarChart) -->
				<!-- <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 mb-5">
					
					<div class="mb-4 shadow-md px-5 py-4 rounded-md">
						<h1 class="text-center font-bold py-2 text-xl">Bar Chart</h1>
						<BarChart {ChartDataSet} />
					</div>
					<div style="margin:5px;">
						<SummaryTable {ChartDataSet} />
					</div>
				</div> -->
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
									<td class="border border-gray-300 p-2">{column.value(row)}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/key}
	{:else}
		<div class="text-center font-semibold text-gray-600">
			<p>No data</p>
			<p>Upload a document to see the Chart</p>
		</div>
	{/if}
</main>

<style>
</style>
