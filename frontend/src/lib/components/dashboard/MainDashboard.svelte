<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import LineChart from '../dashboard/LineChart.svelte';
	import Pie2Chart from '../dashboard/Pie2Chart.svelte';
	import Bar2Chart from '../dashboard/Bar2Chart.svelte';
	import DoughnutChart from '../dashboard/DoughnutChart.svelte';
	import { writable } from 'svelte/store';

	import * as XLSX from 'xlsx/xlsx.mjs';
	import { uploadTradesStore, tradeStore } from '../../../store';
	import { uploadTransactionStore } from '../../../store';
	import { uploadeWeeeklyFigStore, weeklyFigStore } from '../../../store';
	import { BrokerageStore, brokerageIncomeStore } from '../../../store';
	import { uploadInventoryStore, inventoryStore } from '../../../store';
	import CustomModal from '../common/CustomModal.svelte';
	import { Button, Label, Input } from 'flowbite-svelte';

	// import { Line } from 'svelte-chartjs';
	import { DownloadOutline, ShoppingCartSolid, UploadOutline } from 'flowbite-svelte-icons';
	import Spinner from '../Spinner.svelte';
	import CustomAlert from '$lib/components/common/CustomAlert.svelte';

	let csvData: any = [];
	let fileName: string;
	let loading = false;
	let noData = false;

	let lineChartX: any = [];
	let lineChartY: any = [];
	let weekFigs: any = [];

	let brokerageX: any = [];
	let brokerageY: any = [];
	let brokerage: any = [];

	let inventoryCommodities: any = [];
	let inventoryValue: any = [];
	let inventories: any = [];
	let cash_value = 0;
	let security_value = 0;

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
		await HandleData();
		console.log('is visible on mount', isAlertVisible);
	});

	async function HandleData() {
		await uploadeWeeeklyFigStore.get();
		await BrokerageStore.get();
		await uploadInventoryStore.getAll();

		brokerageIncomeStore.subscribe(($brokerStore: any) => {
			brokerage = $brokerStore.data;
			message = $brokerStore.message;
			error = $brokerStore.error;
			// console.log('%', $store);
		});

		weeklyFigStore.subscribe(($store) => {
			weekFigs = $store.data;
			message = $store.message;
			error = $store.error;
			// console.log('%', $store);
		});

		inventoryStore.subscribe(($store) => {
			inventories = $store.data;
			message = $store.message;
			error = $store.error;
			// console.log('%', $store);
		});

		weekFigs.sort((a: any, b: any) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
		brokerage.sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

		weekFigs.forEach((element: any) => {
			lineChartY.push(String(moment(element.DATE).format('D, MMM, YYY')));
			lineChartX.push(element.CASH_AVAILABLE);
		});

		inventories.forEach((element: any) => {
			inventoryCommodities.push(element.COMMODITY);
			inventoryValue.push(element.UNIT_BOUGHT + element.UNIT_SOLD);
		});

		brokerage.forEach((element: any) => {
			brokerageY.push(String(moment(element.month).format('D, MMM, YYY')));
			brokerageX.push(element.amount);
		});

		cash_value = weekFigs.reduce((acc: any, item: { CASH_AVAILABLE: any; CASH_INLIEN: any }) => {
			return item.CASH_AVAILABLE + item.CASH_INLIEN;
		}, 0);

		security_value = weekFigs.reduce(
			(acc: any, item: { SECURITIES_AVAILABLE: any; SECURITIES_INLIEN: any }) => {
				return item.SECURITIES_AVAILABLE + item.SECURITIES_INLIEN;
			},
			0
		);

		console.log('+-=', cash_value, security_value);

		if (weekFigs.length !== 0) {
			showModalData = false;
			loading = false;
		}

		// showAlert();
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

					// if (weekFigs.length != 0) {
					loading = false;
					// }
				});
			};
		}

		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}

	let modal = false;
	let showModalData = false;
	let annualModal = false;

	function openAnnualModal() {
		annualModal = true;
		// ChartDataSet = [];
	}

	function closeAnnualModal() {
		annualModal = false;
		// showModalData = true;
	}

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

	$: {
		if ($weeklyFigStore.error == true) {
			isAlertVisible = true;
			message = $weeklyFigStore.message;
			error = $weeklyFigStore.error;
		}

		if ($brokerageIncomeStore.error == true) {
			isAlertVisible = true;
			message = $brokerageIncomeStore.message;
			error = $brokerageIncomeStore.error;
		}

		if ($inventoryStore.error == true) {
			isAlertVisible = true;
			message = $inventoryStore.message;
			error = $inventoryStore.error;
		}
		showAlert();
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

{#if isAlertVisible && message != null}
	{#if error}
		<CustomAlert color="bg-red-300" {message} />
	{:else}
		<CustomAlert color="bg-green-300" {message} />
	{/if}
{/if}

{#if $weeklyFigStore.data.length == 0 && $weeklyFigStore.noData == false}
	<div>
		<Spinner />
	</div>
{:else}
	<main class="p-10 flex flex-col">
		<div class="flex items-center space-x-6">
			<Button on:click={openModal} class="bg-blue-500 w-40">
				<UploadOutline class="w-3.5 h-3.5  mr-2" />
				Upload Weekly Transaction</Button
			>

			<Button on:click={openAnnualModal} class="bg-blue-500 w-40">
				<UploadOutline class="w-3.5 h-3.5  mr-2" />
				Upload Annual Information</Button
			>
			<Button class="bg-blue-500 w-40" on:click={() => downloadExcelFile('Sample template.xlsx')}>
				<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Sample
			</Button>
			<Button class="bg-blue-500 w-40" on:click={() => downloadExcelFile('Template.xlsx')}>
				<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Template
			</Button>
		</div>
		<CustomModal
			bind:open={annualModal}
			title="Upload Annual Information"
			onClose={closeAnnualModal}
		>
			<div class="w-full">
				<Label for="initial_investment" class="mb-2">Initial Investment</Label>
				<Input type="text" id="initial_investment" placeholder="initial investment" required />
			</div>

			<div class="w-full">
				<Label for="targeted_profit" class="mb-2">Targeted Profit</Label>
				<Input type="text" id="targeted_profit" placeholder="targeted profit" required />
			</div>
		</CustomModal>
		<CustomModal bind:open={modal} onClose={closeModal} title="Upload Your Trading Data">
			<div>
				<form
					name="uploadForm"
					class="flex items-center flex-col space-y-5"
					on:submit={HandleFormSubmit}
				>
					<div class="w-full">
						<span class="font-bold mb-3">Upload a File</span>
						<input
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							id="uploadInput"
							type="file"
							use:HandleFile
							class="opacity-0 cursor-pointer hidden mt-2"
						/>
						<label
							for="uploadInput"
							class="block p-2 border
								 w-full
								border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 mt-3"
						>
							<span class="text-gray-700">{fileName ? fileName : 'Choose a file'}</span>
						</label>
					</div>

					<div class="w-full">
						<span class="block mb-3 font-bold">Security Balance</span>
						<input
							id="yearInput"
							type="text"
							class="w-full rounded-md border-gray-300 p-2 mt-3"
							bind:value={formData.securities_balance}
							required
						/>
					</div>

					<div class="w-full">
						<span class="block mb-3 font-bold">Security InLien</span>
						<input
							id="balanceInput"
							type="text"
							class="w-full rounded-md border-gray-300 p-2 mt-3"
							bind:value={formData.securities_inLien}
							required
						/>
					</div>
					<div class="w-full">
						<span class="block mb-3 font-bold">Cash InLien</span>
						<input
							id="balanceInput"
							type="text"
							class="w-full rounded-md border-gray-300 p-2 mt-3"
							bind:value={formData.cash_inLien}
							required
						/>
					</div>

					<Button type="submit" class="m-5 bg-blue-500 text-white w-full">Submit</Button>
				</form>
			</div>
		</CustomModal>

		{#if $weeklyFigStore.data.length == 0}
			<div class="text-center font-semibold text-gray-600">
				<p>No data</p>
				<p>Upload a document to see the Chart</p>
			</div>
		{:else}
			<section class="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
				<div class="bg-white rounded shadow">
					<h2
						class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
					>
						Transaction Volume
					</h2>
					{#if weekFigs.length != 0}
						<div class="p-4">
							<LineChart chartLabel={lineChartY} chartValues={lineChartX} />
						</div>
					{/if}
				</div>
				<div class="bg-white rounded shadow">
					<h2
						class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
					>
						Monthly Brokerage Income
					</h2>
					{#if brokerage.length != 0}
						<div class="p-4">
							<Bar2Chart chartLabel={brokerageY} chartValues={brokerageX} />
						</div>
					{/if}
				</div>
				<div class="bg-white rounded shadow">
					<h2
						class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
					>
						Inventory
					</h2>
					{#if inventories.length != 0}
						<div class="p-4">
							<DoughnutChart chartLabel={inventoryCommodities} chartValues={inventoryValue} />
						</div>
					{/if}
				</div>

				<div class="bg-white rounded shadow">
					<h2
						class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
					>
						Portfolio Value
					</h2>
					{#if cash_value != 0}
						<div class="p-4">
							<Pie2Chart
								chartLabel={['Cash Value', 'Security Value']}
								chartValues={[cash_value, security_value]}
							/>
						</div>
					{/if}
				</div>
			</section>
		{/if}

		<section class="grid grid-cols-1 xl:grid-cols-2 gap-10 p-4">
			<div class="bg-white rounded shadow">
				<h2
					class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
				>
					Transaction Volume
				</h2>
				{#if weekFigs.length != 0}
					<div class="p-4">
						<LineChart chartLabel={lineChartY} chartValues={lineChartX} />
					</div>
				{/if}
			</div>
			<div class="bg-white rounded shadow">
				<h2
					class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
				>
					Monthly Brokerage Income
				</h2>
				{#if brokerage.length != 0}
					<div class="p-4">
						<Bar2Chart chartLabel={brokerageY} chartValues={brokerageX} />
					</div>
				{/if}
			</div>
			<div class="bg-white rounded shadow">
				<h2
					class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
				>
					Inventory
				</h2>
				{#if inventories.length != 0}
					<div class="p-4">
						<DoughnutChart chartLabel={inventoryCommodities} chartValues={inventoryValue} />
					</div>
				{/if}
			</div>

			<div class="bg-white rounded shadow">
				<h2
					class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
				>
					Portfolio Value
				</h2>
				{#if cash_value != 0}
					<div class="p-4">
						<Pie2Chart
							chartLabel={['Cash Value', 'Security Value']}
							chartValues={[cash_value, security_value]}
						/>
					</div>
				{/if}
			</div>
		</section>
	</main>
{/if}
