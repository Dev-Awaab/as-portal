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
	import { dropDataStore } from '../../../store';
	import { BrokerageStore, brokerageIncomeStore } from '../../../store';
	import { uploadInventoryStore, inventoryStore } from '../../../store';
	import CustomModal from '../common/CustomModal.svelte';
	import { Button, Label, Input } from 'flowbite-svelte';

	// import { Line } from 'svelte-chartjs';
	import {
		DownloadOutline,
		ShoppingCartSolid,
		UploadOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
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

	$: {
		console.log({ cash_value, security_value });
	}

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
	import ProtfolioExpected from './ProtfolioExpected.svelte';
	import { retrive } from '../../../utils';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

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
			const driveTemplateLink =
				'https://drive.google.com/uc?export=download&id=1GbfpfavssH4KOjnxiC8Qxa3UeMy0zhea';
			const response = await fetch(`${driveTemplateLink}`); // await fetch(`/static/${name}`); // Replace with the path to your Excel file

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
	//------------------
	let showDeleteModel = false;

	function showAlert() {
		isAlertVisible = true;
		setTimeout(() => {
			closeAlert();
		}, 3000);
	}

	function closeAlert() {
		isAlertVisible = false;
	}

	function CloseDeleteModel() {
		showDeleteModel = false;
	}

	function OpenDeleteModel() {
		showDeleteModel = true;
	}

	function removeAllData() {
		dropDataStore.delete();
		HandleData();
		showAlert();
		CloseDeleteModel();
	}

	onMount(async () => {
		await HandleData();
		console.log('is visible on mount', isAlertVisible);
	});
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
			<Button on:click={openModal} class="bg-blue-500 w-auto">
				<UploadOutline class="w-3.5 h-3.5  mr-2" />
				Upload Weekly Transaction</Button
			>

			<Button on:click={openAnnualModal} class="bg-blue-500 w-auto">
				<UploadOutline class="w-3.5 h-3.5  mr-2" />
				Upload Annual Information</Button
			>

			<a href="https://drive.google.com/uc?export=download&id=1APWHF-GiJs2aZ0HCuKLu8lBzyH6GEJC1">
				<Button class="bg-blue-500 w-40">
					<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Sample
				</Button>
			</a>

			<a href="https://drive.google.com/uc?export=download&id=1GbfpfavssH4KOjnxiC8Qxa3UeMy0zhea">
				<Button class="bg-blue-500 w-40">
					<DownloadOutline class="w-3.5 h-3.5 mr-2 " /> Template
				</Button>
			</a>

			<Button class="bg-red-500 w-40" on:click={() => OpenDeleteModel()}>
				<TrashBinOutline class="w-3.5 h-3.5 mr-2 " /> Delete All Data
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
				<div class="bg-white rounded shadow">
					<h2
						class="text-center font-bold bg-blue-500 py-5 text-white uppercase tracking-widest text-xl"
					>
						Expected vs Portfolio
					</h2>
					{#if cash_value != 0}
						<div class="p-4">
							<ProtfolioExpected />
						</div>
					{/if}
				</div>
			</section>
		{/if}
	</main>
{/if}

<!-- ---------------------------------
----------------------
------------------------------------
----------------------------------
------------------------------
--------------------------
----------------------------
------------------- -->
{#if showDeleteModel == true}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
							>
								<svg
									class="h-6 w-6 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
							</div>
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
									Drop All Data's
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Are you sure you want to delete all the data from the database? All of your data
										will be permanently removed. This action cannot be undone.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
							on:click={() => removeAllData()}
						>
							Delete All Data
						</button>
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							on:click={CloseDeleteModel}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
