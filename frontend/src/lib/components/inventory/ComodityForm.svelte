<script>
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	/**
	 * @type {any}
	 */
	export let comodityData;
	/**
	 * @type {any}
	 */
	export let comodityName;

	// Sample data
</script>

<div>
	<div class="flex items-center py-5 px-3">
		<Heading tag="h5">{comodityName}</Heading>
	</div>
	<Table class="w-full">
		<TableHead defaultRow={false} class="w-full">
			<TableHeadCell />
			<TableHeadCell>Volume</TableHeadCell>
			<TableHeadCell>Mkt Price</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody>
			{#each comodityData as item (item.label)}
				<TableBodyRow>
					<TableBodyCell>{item.label}</TableBodyCell>
					<TableBodyCell>{item.volume}</TableBodyCell>
					<TableBodyCell>{item.marketPrice}</TableBodyCell>
					<TableBodyCell>{item.value}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<!-- <div class="">
	<TableHeadCell>SMAZ</TableHeadCell>
	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell />
			<TableHeadCell>Volume</TableHeadCell>
			<TableHeadCell>Mkt Price</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody class="divide-y">
			{#each data as item (item.label)}
				<TableBodyRow>
					<TableBodyCell>{item.label}</TableBodyCell>
					<TableBodyCell>{item.volume}</TableBodyCell>
					<TableBodyCell>{item.marketPrice}</TableBodyCell>
					<TableBodyCell>{item.value}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div> -->
