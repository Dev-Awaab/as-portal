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
	import moment from 'moment';
	import Spinner from './Spinner.svelte';
	import { uploadeWeeeklyFigStore, weeklyFigStore } from '../../store';

	let data: any = [];
	let loading = false;

	onMount(async () => {
		try {
			loading = true;
			// const res = await axios.get(
			// 	'https://trade-accounting-demo.onrender.com/api/weeklyfigures/retrive'
			// );
			// data = res.data.data.data;

			const res = await uploadeWeeeklyFigStore.get();

			weeklyFigStore.subscribe(($store) => {
				data = $store.data;
				message = $store.message;
				error = $store.error;
				console.log('%', $store);
			});

			data = data.sort((a: any, b: any) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	});

	// Calculate the total "CASH" by summing "CASH_AVAILABLE" and "CASH_INLIEN"
	let cash: number = 0;

	// Calculate the total "SECURITY" by summing "SECURITIES_AVAILABLE" and "SECURITIES_INLIEN"
	let security: number = 0;

	let portfolioValue: number = 0;

	$: {
		if (data) {
			cash = data.reduce((acc: any, item: { CASH_AVAILABLE: any; CASH_INLIEN: any }) => {
				return item.CASH_AVAILABLE + item.CASH_INLIEN;
			}, 0);

			security = data.reduce(
				(acc: any, item: { SECURITIES_AVAILABLE: any; SECURITIES_INLIEN: any }) => {
					return item.SECURITIES_AVAILABLE + item.SECURITIES_INLIEN;
				},
				0
			);

			portfolioValue = cash + security;
		}
	}

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

{#if loading}
	<Spinner />
{:else}
	<div>
		<div class="flex items-center py-5 px-3">
			<Heading tag="h5">Portfolio Summary</Heading>
			<!--			<Heading tag="h6">Cash: {num(cash)}</Heading>-->
			<!--			<Heading tag="h6">Securtiy Value: {num(security)}</Heading>-->
			<Heading tag="h6">Portfolio Value: {num(portfolioValue)}</Heading>
		</div>
		<Table>
			<TableHead defaultRow={false}>
				<tr>
					<TableHeadCell>Date</TableHeadCell>
					<TableHeadCell class="capitalize">CASH AVAILABLE</TableHeadCell>
					<TableHeadCell class="capitalize">CASH INLIEN</TableHeadCell>
					<TableHeadCell class="capitalize">SECURITIES AVAILABLE</TableHeadCell>
					<TableHeadCell class="capitalize">SECURITIES INLIEN</TableHeadCell>
					<TableHeadCell class="capitalize uppercase">Cash Balance</TableHeadCell>
					<TableHeadCell class="capitalize uppercase">Securtiy Balance</TableHeadCell>
				</tr>
			</TableHead>
			<TableBody>
				{#each data as item, index (item._id)}
					<TableBodyRow key={index}>
						<TableBodyCell>{moment(num(item.DATE)).format('D, MMM, YYYY')}</TableBodyCell>
						<TableBodyCell>{num(item.CASH_AVAILABLE)}</TableBodyCell>
						<TableBodyCell>{num(item.CASH_INLIEN)}</TableBodyCell>
						<TableBodyCell>{num(item.SECURITIES_AVAILABLE)}</TableBodyCell>
						<TableBodyCell>{num(item.SECURITIES_INLIEN)}</TableBodyCell>
						<TableBodyCell>{num(item.CASH_AVAILABLE + item.CASH_INLIEN)}</TableBodyCell>
						<TableBodyCell>{num(item.SECURITIES_AVAILABLE + item.SECURITIES_INLIEN)}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
