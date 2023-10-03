<!-- <script lang="ts">
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { useTradeStore } from '../../store/weeklyFigure';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { dataStore, fetchData } from '../../store/testStore';

	let result: any = [];
	onMount(async () => {
		try {
			const res = await axios.get(
				'https://trade-accounting-demo.onrender.com/api/weeklyfigures/retrive'
			);

			result = res.data.data.data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});
	console.log(result);


	// Calculate the "Total" for each week
	let weeklyTotalData = result?.map((item: any, index: number) => {
		const total = (
			parseInt(item.BUYORDER.replace(/\D/g, '')) + parseInt(item.SELLORDER.replace(/\D/g, ''))
		).toLocaleString('en-NG', {
			style: 'currency',
			currency: 'NGN'
		});
		return { ...item, total };
	});

	// Add the "Total" row at the end
	weeklyTotalData.push({
		date: 'Total',
		buyOrder: weeklyTotalData
			.reduce(
				(total: number, item: { BUYORDER: string }) =>
					total + parseInt(item.BUYORDER.replace(/\D/g, '')),
				0
			)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			}),
		sellOrder: weeklyTotalData
			.reduce(
				(total: number, item: { SELLORDER: string }) =>
					total + parseInt(item.SELLORDER.replace(/\D/g, '')),
				0
			)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			}),
		total: weeklyTotalData
			.reduce(
				(total: number, item: { total: string }) => total + parseInt(item.total.replace(/\D/g, '')),
				0
			)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			})
	});

	console.log(weeklyTotalData)


</script>

<div>
	<div class="flex items-center py-5 px-3">
		<Heading tag="h5">Transaction Volume</Heading>
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
		<TableBody class="divide-y">
			{#each weeklyTotalData as item, index (index)}
				<TableBodyRow>
					<TableBodyCell>{item.date}</TableBodyCell>
					<TableBodyCell>Buy: {item.BUYORDER}</TableBodyCell>
					<TableBodyCell>Sell: {item.SELLORDER}</TableBodyCell>
					<TableBodyCell>{item.total}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div> -->
<!-- src/routes/index.svelte -->
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
	import axios from 'axios';

	let data: any = [];

	console.log(data);

	// Calculate the "Total" by summing "BUYORDER" and "SELLORDER"
	let total: number = 0;

	$: {
		total = data
			?.reduce((acc: number, item: any) => {
				return acc + item.BUYORDER + item.SELLORDER;
			}, 0)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			});
	}

	onMount(async () => {
		try {
			const res = await axios.get(
				'https://trade-accounting-demo.onrender.com/api/weeklyfigures/retrive'
			);

			data = res.data.data.data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	const num = (data: number) => {
		return data.toLocaleString('en-NG', {
			style: 'currency',
			currency: 'NGN'
		});
	};
</script>

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
			</tr>
		</TableHead>
		<TableBody class="divide-y">
			{#each data as item, index (item.BUYORDER)}
				<TableBodyRow key={index}>
					<TableBodyCell>{item.DATE}</TableBodyCell>
					<TableBodyCell>{num(item.BUYORDER)}</TableBodyCell>
					<TableBodyCell>{num(item.SELLORDER)}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
