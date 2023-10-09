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
	import { uploadTransactionStore, transactionStore } from '../../../store';
	import { uploadeWeeeklyFigStore, weeklyFigStore } from '../../../store';

	// import { Line } from 'svelte-chartjs';
	import { DownloadOutline, ShoppingCartSolid, UploadOutline } from 'flowbite-svelte-icons';
	import Spinner from '../Spinner.svelte';
	import CustomAlert from '$lib/components/common/CustomAlert.svelte';

	export let ChartDataSet: any[] = [];
	let csvData: any = [];
	let DemoChart: Chart;
	let PieChartData: any[] = [];
	let commodities: string[] = ['SSBS', 'SPRL', 'SCSN', 'SMAZ', 'SCSN'];
	let fileName: string;
	let loading = false;

	let lineChartX: any = [];
	let lineChartY: any = [];
	let weekFigs: any;

	import SvelteTable from 'svelte-table';
	import CustomModal from '../common/CustomModal.svelte';
	import {
		Button,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		await uploadTradesStore.getAll();
		await uploadeWeeeklyFigStore.get();

		let rowObject: any = 0;
		tradeStore.subscribe(($tradeStore) => (rowObject = $tradeStore));

		weeklyFigStore.subscribe(($store) => {
			weekFigs = $store.data;
			message = $store.message;
			error = $store.error;
			console.log('%', $store);
		});

		weekFigs.sort((a: any, b: any) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());

		console.log('_________', weekFigs);

		rowObject.sort((a: any, b: any) => a.DATE - b.DATE);

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

		rows = [...rowObject];

		weekFigs.forEach((element: any) => {
			lineChartY.push(String(moment(element.DATE).format('D, MMM, YYY')));
			lineChartX.push(element.CASH_AVAILABLE);
		});

		if (weekFigs.length !== 0) {
			showModalData = false;
			loading = false;
		}

		showAlert();

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

					csvData = [...rowObject];

					rowObject = HandleData();

					console.log(rowObject);

					// DemoChart.data.datasets[0].data = ChartDataSet;
					// DemoChart.update();
					rows = [...rowObject];
					if (ChartDataSet.length !== 0 || weekFigs.length != 0) {
						loading = false;
					}
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

	function HandleFormSubmit(value: any) {
		console.log('Form data:', formData);

		loading = true;

		uploadTransactionStore.upload(csvData, formData);
		HandleData();

		modal = false;
	}

	import { Line } from 'svelte-chartjs';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	var data = {
		labels: lineChartY,
		datasets: [
			{
				label: 'My First dataset',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(225, 204,230, .3)',
				borderColor: 'rgb(205, 130, 158)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(105, 30, 208)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 4,
				pointHoverRadius: 2,
				pointHoverBackgroundColor: 'rgb(20, 50, 30)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: lineChartX
			}
		]
	};

	let formData = {
		securities_balance: 0,
		securities_inLien: 0,
		cash_inLien: 0
	};
	async function downloadExcelFile(name: string) {
		try {
			const response = await fetch(`/static/${name}`); // Replace with the path to your Excel file
			const blob = await response.blob();

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${name}`; // Set the filename with .xlsx extension
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading the Excel file:', error);
		}
	}

	let isAlertVisible = false;
	let error = false;
	let message: string | null = null;

	function showAlert() {
		isAlertVisible = true;
		setTimeout(() => {
			closeAlert();
		}, 3000);
	}

	function closeAlert() {
		isAlertVisible = false;
	}
</script>

{#if isAlertVisible && error}
	<CustomAlert color="bg-red-300" {message} />
{/if}

{#if $weeklyFigStore.data.length == 0}
	<div>
		<Spinner />
	</div>
{:else}
	<main class="p-10 flex flex-col">
		<div class="flex items-center space-x-6">
			<Button on:click={openModal} class="bg-blue-500 w-40">
				<UploadOutline class="w-3.5 h-3.5  mr-2" />
				Upload Data</Button
			>

			<Button class="bg-blue-500 w-40" on:click={() => downloadExcelFile('Sample template.xlsx')}>
				<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Sample
			</Button>
			<Button class="bg-blue-500 w-40" on:click={() => downloadExcelFile('Template.xlsx')}>
				<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Template
			</Button>
		</div>
		<CustomModal bind:open={modal} onClose={closeModal} title="Upload Your Trading Data">
			<div>
				<form
					name="uploadForm"
					class="flex items-center flex-col space-y-5"
					on:submit={HandleFormSubmit}
				>
					<div>
						<div class="">
							<span class="font-bold">Upload a File</span>
							<input
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								id="uploadInput"
								type="file"
								use:HandleFile
								class="opacity-0 cursor-pointer"
							/>
							<label
								for="uploadInput"
								class="block p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
							>
								<span class="text-gray-700">{fileName ? fileName : 'Choose a file'}</span>
							</label>
						</div>
					</div>

					<div class="w-full">
						<span class="block mb-3 font-bold">Security Balance</span>
						<input
							id="yearInput"
							type="text"
							class="w-full"
							bind:value={formData.securities_balance}
							required
						/>
					</div>

					<div class="w-full">
						<span class="block mb-3 font-bold">Security InLien</span>
						<input
							id="balanceInput"
							type="text"
							class="w-full"
							style="margin-top: 2px;"
							bind:value={formData.securities_inLien}
							required
						/>
					</div>
					<div class="w-full">
						<span class="block mb-3 font-bold">Cash InLien</span>
						<input
							id="balanceInput"
							type="text"
							class="w-full"
							style="margin-top: 2px;"
							bind:value={formData.cash_inLien}
							required
						/>
					</div>

					<Button type="submit" class="m-5 bg-blue-500 text-white w-full">Submit</Button>
				</form>
			</div>
		</CustomModal>

		{#if ChartDataSet.length === 0 && !modal}
			<div class="text-center font-semibold text-gray-600">
				<p>No data</p>
				<p>Upload a document to see the Chart</p>
			</div>
		{/if}

		{#if loading}
			<div
				style="margin: auto;"
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
				role="status"
			>
				<span
					class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
					>Loading...</span
				>
			</div>
		{:else if ChartDataSet.length !== 0 || showModalData}
			{#if true}
				{#key ChartDataSet}
					<div class="flex flex-wrap justify-center">
						<Line {data} options={{ responsive: true }} />
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
			{/if}
		{/if}
	</main>
{/if}
