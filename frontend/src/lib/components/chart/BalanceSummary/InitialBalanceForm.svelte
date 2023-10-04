<script lang="ts">
	import type { ComponentType, SvelteComponent, ComponentEvents } from 'svelte';
	import axios from 'axios';
	import moment from 'moment';
	import { onMount } from 'svelte';

	import {
		uploadTradesStore,
		tradeStore,
		initalCapitalStore,
		capitalStore
	} from '../../../../store';

	import CustomModal from '../../common/CustomModal.svelte';
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

	onMount(async () => {
		HandleData();
	});

	async function HandleData() {
		await initalCapitalStore.getCapitalData();
		let rowObject: any = rows;
		capitalStore.subscribe(($capitalStore) => (rowObject = $capitalStore));
		// console.log('Getting list of Capitals ', rowObject);

		rowObject.sort((a: any, b: any) => a.year - b.year);

		rows = [...rowObject];
		// console.log(rows);

		rows.reverse();
	}

	let formData = {
		year: 2022,
		initalCapital: 100,
		performaceTarget: 100
	};
	function HandleFormSubmit(value: any) {
		console.log('Form data:', formData);
		initalCapitalStore.send(formData);

		rows.push({
			year: formData.year,
			initalCapital: formData.initalCapital,
			performaceTarget: formData.performaceTarget
		});
		modal = false;
	}

	export let rows: any[] = [
		{
			year: 2020,
			initalCapital: 31019528.28,
			performanceTarget: 4000000
		},
		{
			year: 2021,
			initalCapital: 41019528.28,
			performanceTarget: 4000000
		},
		{
			year: 2022,
			initalCapital: 51019528.28,
			performanceTarget: 4000000
		},
		{
			year: 2023,
			initalCapital: 81019528.28,
			performanceTarget: 4000000
		}
	];
	let columns = [
		/** columns config (example below) */
		{
			key: 'date',
			title: 'YEAR',
			value: (v: any) => v.year
		},
		{
			key: 'capital',
			title: 'CAPITAL BALANCE',
			value: (v: any) => v.initalCapital
		},
		{
			key: 'target',
			title: 'Perfomace Target',
			value: (v: any) => v.performanceTarget
		}
	];

	let modal = false;
	let showModalData = false;

	function openModal() {
		modal = true;
	}

	function closeModal() {
		modal = false;
		showModalData = true;
	}

	function formatNumber(data: number) {
		return data.toLocaleString('en-Ng', {
			style: 'currency',
			currency: 'NGN'
		});
	}
	function formatPerfromace(data: number) {
		if (!data) data = 0;

		return data.toLocaleString('en-Ng', {
			style: 'currency',
			currency: 'NGN'
		});
	}
</script>

<main class="md:p-10 p-5 flex flex-col">
	<Button on:click={openModal} class="bg-orange-500 text-white w-40 mb-5 ">Enter New Capital</Button
	>

	<CustomModal
		bind:open={modal}
		onClose={closeModal}
		title="Enter The Current Year Starting Capital"
	>
		<div class="py-10">
			<form
				name="uploadForm"
				class="flex w-full mb-3 flex-col justify-center items-center space-y-5"
				on:submit={HandleFormSubmit}
			>
				<div class="w-full">
					<span class="block mb-3 font-bold">Enter Year a File</span>
					<input id="yearInput" type="text" class="w-full" bind:value={formData.year} required />
				</div>

				<div class="w-full">
					<span class="block mb-3 font-bold">Enter Balance</span>
					<input
						id="balanceInput"
						type="text"
						class="w-full"
						style="margin-top: 2px;"
						bind:value={formData.initalCapital}
						required
					/>
				</div>

				<div class="w-full">
					<span class="block mb-3 font-bold">Enter Performace Target </span>
					<input
						id="balanceInput"
						type="text"
						class="w-full"
						style="margin-top: 2px;"
						bind:value={formData.performaceTarget}
						required
					/>
				</div>

				<Button type="submit" class="m-5 bg-blue-500 text-white w-full">Submit</Button>
			</form>
		</div>
	</CustomModal>

	{#if rows.length === 0 && !modal}
		<div class="text-center font-semibold text-gray-600">
			<p>No data</p>
		</div>
	{/if}

	<div class="flex items-center py-5 px-3">
		<Heading tag="h5">Initial Capital</Heading>
	</div>

	<Table color="default" hoverable={true}>
		<TableHead defaultRow={false}>
			<tr>
				{#each columns as column}
					<TableHeadCell>{column.title}</TableHeadCell>
				{/each}
			</tr>
		</TableHead>
		<TableBody class="divide-y">
			{#each rows as row}
				<TableBodyRow>
					{#each columns as column}
						<TableBodyCell class="border border-gray-300 p-5">
							{#if column.key === 'capital'}
								{formatNumber(column.value(row))}
							{:else if column.key === 'target'}
								{formatPerfromace(column.value(row))}
							{:else}
								{column.value(row)}
							{/if}
						</TableBodyCell>
					{/each}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>

	<!-- {#if rows.length !== 0}
		{#key rows}
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
	{/if} -->
</main>
