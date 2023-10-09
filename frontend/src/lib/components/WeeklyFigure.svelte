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

	let data: any = [];
	let loading = false;

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

			let sorted = data.sort(
				(a: any, b: any) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime()
			);
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

	function showAlert() {
		isAlertVisible = true;
		setTimeout(() => {
			closeAlert();
		}, 3000);
	}

	function closeAlert() {
		isAlertVisible = false;
	}

	console.log(data);
</script>

{#if isAlertVisible && error}
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
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
