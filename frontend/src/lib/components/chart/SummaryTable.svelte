<script lang="ts">
	import moment from 'moment';
	import SvelteTable from 'svelte-table';
	import { onMount } from 'svelte';

	export let ChartDataSet: any[] = [];

	onMount(async () => {
		var tempRow = [];
		if (ChartDataSet != null) {
			for (var i = 0; i < ChartDataSet.length; i += 1) {
				var rowObject;
				rowObject = { DATE: ChartDataSet[i].x, BALANCE: ChartDataSet[i].y };
				tempRow.push(rowObject);
				// console.log('inside Summary Table');
				// console.log(ChartDataSet);
				// console.log(rows);
			}
			rows = [...tempRow];
			// console.log(rows);
		}
	});

	let rows = [
		{
			DATE: moment().format('MMM, YYYY'),
			BALANCE: 81019535.51
		}
	];
	const columns = [
		/** columns config (example below) */
		{
			key: 'date',
			title: 'STD Transaction Volume',
			value: (v: any) => v.DATE,
			class: 'text-center' // Optional: Add custom classes here
		},
		{
			key: 'balance',
			title: 'BALANCE',
			value: (v: any) => v.BALANCE,
			class: 'text-center' // Optional: Add custom classes here
		}
	];
</script>

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

<!-- Add this style block to your Svelte component -->
<style>
	/* Optional: Customize additional styles here */
</style>
