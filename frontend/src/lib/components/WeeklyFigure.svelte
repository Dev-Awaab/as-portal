<script lang="ts">
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { elements } from 'chart.js';
	import Spinner from './Spinner.svelte';
	import { uploadeWeeeklyFigStore, weeklyFigStore } from '../../store';
	import CustomAlert from '$lib/components/common/CustomAlert.svelte';
	import { TrashBinOutline } from 'flowbite-svelte-icons';

	let data: any = [];
	let loading = false;

	let total: number = 0;

	$: {
		data = data.sort((a: any, b: any) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());

		total = data
			?.reduce((acc: number, item: any) => {
				return acc + item.BUYORDER + item.SELLORDER;
			}, 0)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			});

		showAlert();
	}

	onMount(async () => {
		try {
			loading = true;
			const res = await uploadeWeeeklyFigStore.get();

			weeklyFigStore.subscribe(($store) => {
				data = $store.data;
				message = $store.message;
				error = $store.error;
				console.log('%', $store);
			});
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	});

	const num = (data: number) => {
		return data.toLocaleString('en-NG', {
			style: 'currency',
			currency: 'NGN'
		});
	};

	let isAlertVisible = false;
	let error = false;
	let message: string | null = null;
	let showDeleteModel = false;
	let currentItemId: string | null = null;

	function CloseDeleteModel() {
		showDeleteModel = false;
		currentItemId = null;
		console.log('in close ', currentItemId);
	}

	function OpenDeleteModel(id: string) {
		currentItemId = id;
		console.log('in open model ', currentItemId);
		showDeleteModel = true;
	}

	function showAlert() {
		isAlertVisible = true;
		setTimeout(() => {
			closeAlert();
		}, 3000);
	}

	function closeAlert() {
		isAlertVisible = false;
	}

	function handleDelete() {
		console.log('in handle deelte', currentItemId);

		if (currentItemId != null) uploadeWeeeklyFigStore.delete(currentItemId);

		CloseDeleteModel();

		showAlert();
	}

	console.log(data);

	$: {
		// console.log('=======', $weeklyFigStore.message);
		if ($weeklyFigStore.error == true) {
			isAlertVisible = true;
			message = $weeklyFigStore.message;
		}
		showAlert();
	}
</script>

{#if isAlertVisible && message != null}
	<CustomAlert color="bg-red-300" {message} />
{/if}

{#if loading}
	<Spinner />
{:else}
	<div>
		<div class="flex items-center py-5 px-3">
			<Heading tag="h5">Transaction Volume</Heading>
			<Heading tag="h6">Total: {total}</Heading>
		</div>
		<Table>
			<TableHead defaultRow={false}>
				<tr>
					<TableHeadCell>Date</TableHeadCell>
					<TableHeadCell>Buy Order</TableHeadCell>
					<TableHeadCell>Sell Order</TableHeadCell>
					<TableHeadCell>Total</TableHeadCell>
				</tr>
			</TableHead>
			<TableBody>
				{#each data as item, index (item._id)}
					<TableBodyRow key={index}>
						<TableBodyCell>{moment(item.DATE).format('D, MMM, YYYY')}</TableBodyCell>
						<TableBodyCell>{num(item.BUYORDER)}</TableBodyCell>
						<TableBodyCell>{num(item.SELLORDER)}</TableBodyCell>
						<TableBodyCell>{num(item.SELLORDER + item.BUYORDER)}</TableBodyCell>
						<TableBodyCell>
							<button
								type="button"
								class="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								on:click={() => OpenDeleteModel(item._id)}
							>
								<TrashBinOutline class="w-3.5 h-3.5 mr-2 " />
							</button>
							<!-- {item._id} -->
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
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
									Are you sure you want to delete this data?
								</h3>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
							on:click={() => handleDelete()}
						>
							Delete
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
