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
	import axios from 'axios';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import Spinner from './Spinner.svelte';
	import { BrokerageStore, brokerageIncomeStore } from '../../store';

	// Sample data for Brokerage Fee Earned
	let data = [
		{ month: 'Nov-22', amount: 2376779 },
		{ month: 'Dec-22', amount: 2351498 },
		{ month: 'Jan-23', amount: 1150778 },
		{ month: 'Feb-23', amount: 3680033 },
		{ month: 'Mar-23', amount: 2179627 },
		{ month: 'Apr-23', amount: 1104471 },
		{ month: 'May-23', amount: 908946 },
		{ month: 'Jun-23', amount: 295982 }
	];

	let loading = false;
	let total: number = 0;

	$: {
		// Calculate the total sum of amounts
		data.forEach((item) => (total += item.amount));
	}

	onMount(async () => {
		try {
			loading = true;
			// const res = await axios.get(
			// 	// 'http://127.0.0.1:7001/api/transactions/brokerageIncome'
			// 	'https://trade-accounting-demo.onrender.com/api/transactions/brokerageIncome'
			// );

			// let Ldata = res.data.data.data;

			let Ldata: any[] = [];
			let isAlertVisible = false;
			let error = false;
			let message: string | null = null;
			await BrokerageStore.get();
			brokerageIncomeStore.subscribe(($store) => {
				Ldata = $store.data;
				message = $store.message;
				error = $store.error;
				console.log('%', $store);
			});

			let sorted = Ldata.sort(
				(a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime()
			);

			data = sorted;
			total = 0;
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

	$: console.log('bf', data);
</script>

{#if loading}
	<Spinner />
{:else}
	<div>
		<div class="flex items-center py-5 px-3">
			<Heading tag="h5">Brokerage Fee Earned</Heading>
		</div>
		<Table class="w-full">
			<TableHead defaultRow={false} class="w-full">
				<tr class="w-full">
					<TableHeadCell>Month</TableHeadCell>
					<TableHeadCell>Amount</TableHeadCell>
				</tr>
			</TableHead>
			<TableBody>
				{#each data as item (item.month)}
					<TableBodyRow>
						<TableBodyCell>{moment(item.month).format('DD, MMM, YYYY')}</TableBodyCell>
						<TableBodyCell>{num(item.amount)}</TableBodyCell>
					</TableBodyRow>
				{/each}
				<TableBodyRow>
					<TableBodyCell>Total</TableBodyCell>
					<TableBodyCell>{num(total)}</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</div>
{/if}
