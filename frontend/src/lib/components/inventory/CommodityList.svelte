<script lang="ts">
	import { type ComponentType, type SvelteComponent, type ComponentEvents, onMount } from 'svelte';
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button
	} from 'flowbite-svelte';
	import { uploadInventoryStore, inventoryStore } from '../../../store';
	import { TrashBinOutline } from 'flowbite-svelte-icons';

	/**
	 * @type {any}
	 */
	export let comodityData: any;
	/**
	 * @type {any}
	 */
	// export let comodityName: any;
	let displayData: any = [];
	export let showDelete: Boolean = false;

	onMount(async () => {
		HandleData();
	});

	$: {
		HandleData();
	}

	function HandleData() {
		console.log();

		displayData.push({
			label: 'Units Bought',
			volume: comodityData.VOL_BUY,
			marketPrice: comodityData.AVG_BUY,
			value: comodityData.UNIT_BOUGHT
		});

		displayData.push({
			label: 'Units Sold',
			volume: comodityData.VOL_SELL,
			marketPrice: comodityData.AVG_SELL,
			value: comodityData.UNIT_SOLD
		});

		displayData.push({
			label: 'Margin',
			volume: '',
			marketPrice: comodityData.MARGIN,
			value: ''
		});

		// console.log('_________', displayData);
	}

	// console.log('_________', comodityData);
	const formatNum = (data: number) => {
		return data.toLocaleString('en-NG', {
			style: 'currency',
			currency: 'NGN'
		});
	};

	function handleDelete(_id: string) {
		console.log(_id);
		uploadInventoryStore.delete(_id);
	}
</script>

<div>
	<div class="flex items-center py-5 px-3 bg-blue-500 border-b">
		<Heading tag="h5">{comodityData.COMMODITY}</Heading>
		{#if showDelete}
			<button
				type="button"
				class="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				on:click={() => handleDelete(comodityData._id)}
			>
				<TrashBinOutline class="w-3.5 h-3.5 mr-2 " />
			</button>
		{/if}
	</div>
	<Table class="w-full">
		<TableHead defaultRow={false} class="w-full bg-blue-300">
			<TableHeadCell />
			<TableHeadCell>Volume</TableHeadCell>
			<TableHeadCell>Avg Price</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell>Inventory</TableBodyCell>
				<TableBodyCell>{comodityData.VOLUME}</TableBodyCell>
				<TableBodyCell>{formatNum(comodityData.MKT_PRICE)}</TableBodyCell>
				<TableBodyCell>{formatNum(comodityData.VALUE)}</TableBodyCell>
			</TableBodyRow>
		</TableBody>

		<TableHead defaultRow={false} class="w-full bg-blue-300">
			<TableHeadCell />
			<TableHeadCell>Volume</TableHeadCell>
			<TableHeadCell>Mkt Price</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody>
			{#each displayData as item (item.label)}
				<TableBodyRow>
					<TableBodyCell>{item.label}</TableBodyCell>
					<TableBodyCell>{item.volume}</TableBodyCell>
					<TableBodyCell>{formatNum(item.marketPrice)}</TableBodyCell>
					<TableBodyCell>{formatNum(item.value)}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
