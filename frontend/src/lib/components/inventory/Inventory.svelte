<script lang="ts">
	import ComodityForm from './ComodityForm.svelte';
	import { scsnData, smazData, sprlData, ssbsData, ssgmData } from './data';

	import { Button, Label, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { UploadOutline } from 'flowbite-svelte-icons';
	import Spinner from '../Spinner.svelte';
	import CustomModal from '../common/CustomModal.svelte';
	import { uploadInventoryStore, inventoryStore } from '../../../store';
	import * as XLSX from 'xlsx/xlsx.mjs';
	import CommodityList from './CommodityList.svelte';
	import CustomAlert from '$lib/components/common/CustomAlert.svelte';

	// export let comodityName: any;

	let fileName: string;
	let loading = false;
	let csvData: any = [];
	let rowObject: any = [];
	export let showDelete: Boolean = false;

	let modal = false;
	let showModalData = false;

	$: {
		if (loading == true) {
			if (rowObject.length !== 0) {
				showModalData = false;
				loading = false;
			}
		}
	}

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		await uploadInventoryStore.getAll();

		let rowObject: any = 0;
		inventoryStore.subscribe(($inventoryStore) => {
			rowObject = $inventoryStore.data;
			message = $inventoryStore.message;
			error = $inventoryStore.error;
		});

		// console.log('inside inventory_________', rowObject);

		rowObject.sort((a: any, b: any) => a.DATE - b.DATE);

		if (rowObject.length !== 0) {
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
			// console.log(fileList);
			if (fileList.length > 0) {
				fileName = fileList[0].name; // Update the displayed file name
			}
			let fileReader = new FileReader();
			fileReader.readAsBinaryString(fileList[0]);
			fileReader.onload = (event: ProgressEvent<FileReader>) => {
				let data = event.target!.result as string;
				let workbook = XLSX.read(data, { type: 'binary' });
				// console.log(workbook);
				workbook.SheetNames.forEach((sheet: string) => {
					let rowObj = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);

					csvData = [...rowObj];

					// rowObject = HandleData();

					// console.log(csvData);
				});
			};
		}

		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
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
		// console.log('Form data:', formData);

		loading = true;

		// uploadInventoryStore.upload(csvData);
		// HandleData();

		uploadInventoryStore.sendFormData(formData);
		HandleData();
		console.log(formData);

		modal = false;
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

	let formData = {
		COMMODITY: 0,
		DATE: 'April 28, 2023',
		VOLUME: 0,
		VOL_BUY: 0,
		VOL_SELL: 0
	};

	$: {
		// console.log('=======', $inventoryStore.message);
		if ($inventoryStore.error == true) {
			isAlertVisible = true;
			message = $inventoryStore.message;
			error = $inventoryStore.error;
		}
		showAlert();
	}
</script>

{#if isAlertVisible && message != null}
	{#if error}
		<CustomAlert color="bg-red-300" {message} />
	{:else}
		<CustomAlert color="bg-green-300" {message} />
	{/if}
{/if}

{#if loading}
	<Spinner />
{:else}
	<div class="space-y-5">
		<div class="p-10 flex flex-col">
			<!-- <div class="flex items-center space-x-6">
				<Button on:click={openModal} class="bg-blue-500 w-40">
					<UploadOutline class="w-3.5 h-3.5  mr-2" />
					Upload Data</Button
				>
			</div> -->
			<CustomModal bind:open={modal} onClose={closeModal} title="Upload Your Trading Data">
				<div>
					<form
						name="uploadForm"
						class="flex items-center flex-col space-y-5"
						on:submit={HandleFormSubmit}
					>
						<!-- <div>
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
						</div> -->

						<div class="w-full">
							<Label for="first_name" class="mb-2">Commodity NAME</Label>
							<Input
								type="text"
								id="first_name"
								placeholder="inventory volume"
								bind:value={formData.COMMODITY}
								required
							/>
						</div>

						<div class="w-full">
							<Label for="first_name" class="mb-2">Commodity Inventory Volume</Label>
							<Input
								type="text"
								id="first_name"
								placeholder="0"
								bind:value={formData.VOLUME}
								required
							/>
						</div>

						<div class="w-full">
							<Label for="first_name" class="mb-2">Buy Volume</Label>
							<Input
								type="text"
								id="first_name"
								placeholder="0"
								bind:value={formData.VOL_BUY}
								required
							/>
						</div>

						<div class="w-full">
							<Label for="first_name" class="mb-2">Sell Volume</Label>
							<Input
								type="text"
								id="first_name"
								placeholder="0"
								bind:value={formData.VOL_SELL}
								required
							/>
						</div>
						<Button type="submit" class="m-5 bg-blue-500 text-white w-full">Submit</Button>
					</form>
				</div>
			</CustomModal>
		</div>

		{#if $inventoryStore.data.length != 0}
			{#each $inventoryStore.data as item (item)}
				<!-- {console.log(item)} -->
				<CommodityList comodityData={item} {showDelete} />
			{/each}
		{:else}
			<div class="text-center font-semibold text-gray-600">
				<p>No data</p>
				<p>Upload a document to see the Chart</p>
			</div>
		{/if}
	</div>
{/if}
