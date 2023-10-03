<script lang="ts">
	import type { ComponentType, SvelteComponent, ComponentEvents } from 'svelte';
	import axios from 'axios';
	import Chart from 'chart.js/auto';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import BarChart from '../BarChart.svelte';

	import * as XLSX from 'xlsx/xlsx.mjs';
	import { uploadTradesStore, tradeStore } from '../../../../store';

	export let ChartDataSet: any[] = [];
	export let VolumeDataSet: any[] = [];
	let DemoChart: Chart;
	let commodities: string[] = ['SSBS', 'SPRL', 'SCSN', 'SMAZ', 'SCSN'];
	let fileName: string;

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		await uploadTradesStore.getAll();

		let rowObject: any = rows;
		tradeStore.subscribe(($tradeStore) => (rowObject = $tradeStore));

		rowObject.sort((a: any, b: any) => a.DATE - b.DATE);

		for (let i = 0; i < rowObject.length; i += 1) {
			const serialDate: any = rowObject[i].DATE;
			const daysSince1900: any = serialDate - 1; // Excel incorrectly considers 1900 as a leap year
			const millisecondsPerDay: any = 24 * 60 * 60 * 1000;
			const dateValue: any = new Date(Date.UTC(1900, 0, 1) + daysSince1900 * millisecondsPerDay);

			let momentDate = moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('MMM, YYYY');
			rowObject[i].DATE = momentDate;

			let volume = rowObject[i].TRADEVOLUME;
			console.log(volume);

			rowObject[i].BROKERAGEINCOME =
				volume * (rowObject[i].DEBIT * 0.3 + rowObject[i].CREDIT * 0.4);

			ChartDataSet[i] = { x: rowObject[i].DATE, y: rowObject[i].BROKERAGEINCOME };
			// console.log(rowObject);
			VolumeDataSet[i] = { x: rowObject[i].DATE, y: volume };
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

					//uploadTradesStore.upload(rowObject);
					//HandleData();
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

	let initalBalance = 41019528.28;
	let rows: any[] = [];
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
			<div class="flex flex-wrap justify-center h">
				<!-- first row -->
				<div class="w-full">
					<!-- First Chart (Assuming it's BarChart) -->
					<div class="mb-4 shadow-md px-5 py-2 rounded-md">
						<p class="text-center font-bold tracking-wider py-2 text-xl">Brokerage InCome</p>
						<!-- <canvas id="acquisitions" use:DisplayChart /> -->
						<BarChart {ChartDataSet} />
					</div>
				</div>
			</div>
		{/key}

		{#key VolumeDataSet}
			<div class="flex flex-wrap justify-center">
				<!-- first row -->
				<div class="w-full">
					<!-- First Chart (Assuming it's BarChart) -->
					<div class="mb-4 shadow-md px-5 py-2 rounded-md">
						<p class="text-center font-bold tracking-wider py-2 text-xl">Volume Data</p>
						<!-- <canvas id="acquisitions" use:DisplayChart /> -->
						<BarChart ChartDataSet={VolumeDataSet} chartID={'volumedata'} />
					</div>
				</div>
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
