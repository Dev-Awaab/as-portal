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

	// Define a TypeScript interface for the data
	interface PortfolioData {
		date: string;
		cash: string;
		availableCash: string;
		lienBalanceCash: string;
		securities: string;
		availableSecurities: string;
		lienBalanceSecurities: string;
	}

	let loading = false;
	let success = false;
	let error = false;
	let message: string | null = null;
	let trades = null;

	const unsubscribe = useTradeStore.subscribe((state) => {
		loading = state.loading;
		error = state.error;
		success = state.success;
		message = state.message;
		trades = state.trades;
	});

	console.log(trades);

	// Sample data for Portfolio Value, Cash, Available, Lien Balance, and Securities
	const data: PortfolioData[] = [
		{
			date: '1/21/2023',
			cash: '₦ 194,700,953.31',
			availableCash: '₦ 87,909,743.24',
			lienBalanceCash: '₦ 106,791,210.07',
			securities: '₦ 289,232,621.98',
			availableSecurities: '₦ 135,086,645.96',
			lienBalanceSecurities: '₦ 154,145,976.02'
		},
		{
			date: '1/28/2023',
			cash: '₦ 194,700,953.31',
			availableCash: '₦ 87,909,743.24',
			lienBalanceCash: '₦ 106,791,210.07',
			securities: '₦ 289,232,621.98',
			availableSecurities: '₦ 135,086,645.96',
			lienBalanceSecurities: '₦ 154,145,976.02'
		},
		{
			date: '2/4/2023',
			cash: '₦ 194,700,953.31',
			availableCash: '₦ 87,909,743.24',
			lienBalanceCash: '₦ 106,791,210.07',
			securities: '₦ 289,232,621.98',
			availableSecurities: '₦ 135,086,645.96',
			lienBalanceSecurities: '₦ 154,145,976.02'
		},
		{
			date: '2/11/2023',
			cash: '₦ 194,700,953.31',
			availableCash: '₦ 87,909,743.24',
			lienBalanceCash: '₦ 106,791,210.07',
			securities: '₦ 289,232,621.98',
			availableSecurities: '₦ 135,086,645.96',
			lienBalanceSecurities: '₦ 154,145,976.02'
		}
		// Add more data rows here...
	];

	// Calculate totals dynamically
	const calculateTotal = (key: string): string => {
		return data
			.reduce((total, item) => {
				const value = parseFloat(item[key].replace('₦', '').replace(/,/g, ''));
				return total + value;
			}, 0)
			.toLocaleString('en-NG', {
				style: 'currency',
				currency: 'NGN'
			});
	};

	onMount(async () => await useTradeStore.getTrades());
</script>

<div>
	<div class="flex items-center py-5 px-3">
		<Heading tag="h5">Portfolio Overview</Heading>
	</div>
	<Table>
		<TableHead defaultRow={false}>
			<tr>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Cash</TableHeadCell>
				<TableHeadCell>Available Cash</TableHeadCell>
				<TableHeadCell>Lien Balance Cash</TableHeadCell>
				<TableHeadCell>Securities</TableHeadCell>
				<TableHeadCell>Available Securities</TableHeadCell>
				<TableHeadCell>Lien Balance Securities</TableHeadCell>
				<TableHeadCell>Total</TableHeadCell>
			</tr>
		</TableHead>
		<TableBody class="divide-y">
			{#each data as item (item.date)}
				<TableBodyRow>
					<TableBodyCell>{item.date}</TableBodyCell>
					<TableBodyCell>{item.cash}</TableBodyCell>
					<TableBodyCell>{item.availableCash}</TableBodyCell>
					<TableBodyCell>{item.lienBalanceCash}</TableBodyCell>
					<TableBodyCell>{item.securities}</TableBodyCell>
					<TableBodyCell>{item.availableSecurities}</TableBodyCell>
					<TableBodyCell>{item.lienBalanceSecurities}</TableBodyCell>
					<TableBodyCell>{calculateTotal('cash')}</TableBodyCell>
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

	// Calculate the total "CASH" by summing "CASH_AVAILABLE" and "CASH_INLIEN"
	let cash: number = 0;

	// Calculate the total "SECURITY" by summing "SECURITIES_AVAILABLE" and "SECURITIES_INLIEN"
	let security: number = 0;

	let portfolioValue: number = 0;

	$: {
		if (data) {
			cash = data.reduce((acc, item) => {
				return acc + item.CASH_AVAILABLE + item.CASH_INLIEN;
			}, 0);

			security = data.reduce((acc, item) => {
				return acc + item.SECURITIES_AVAILABLE + item.SECURITIES_INLIEN;
			}, 0);

			portfolioValue = cash + security;
		}
	}

	const num = (data: number) => {
		return data.toLocaleString('en-NG', {
			style: 'currency',
			currency: 'NGN'
		});
	};
</script>

<div>
	<div class="flex items-center py-5 px-3">
		<Heading tag="h5">Portfolio Summary</Heading>
		<Heading tag="h6">Cash: {num(cash)}</Heading>
		<Heading tag="h6">Securtiy Value: {num(security)}</Heading>
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
			</tr>
		</TableHead>
		<TableBody class="divide-y">
			{#each data as item, index (item.CASH_AVAILABLE)}
				<TableBodyRow key={index}>
					<TableBodyCell>{num(item.DATE)}</TableBodyCell>
					<TableBodyCell>{num(item.CASH_AVAILABLE)}</TableBodyCell>
					<TableBodyCell>{num(item.CASH_INLIEN)}</TableBodyCell>
					<TableBodyCell>{num(item.SECURITIES_AVAILABLE)}</TableBodyCell>
					<TableBodyCell>{num(item.SECURITIES_INLIEN)}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
