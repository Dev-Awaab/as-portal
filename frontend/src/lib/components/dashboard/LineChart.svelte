<script lang="ts">
	import { Line } from 'svelte-chartjs';
	// import { data } from './data.js';

	export var chartLabel: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	export var chartValues: any[] = [2000000, 1900000, 2500000, 2400000, 1800000, 1700000, 1400000]; // Loan Disbursed in NAIRA

	export let data = {
		labels: chartLabel,
		datasets: [
			{
				label: 'Transaction Volume',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(255, 165, 0, .3)', // Orange color
				borderColor: 'rgb(255, 140, 0)', // Slightly darker orange
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(205, 130, 158)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: chartValues
			}
		]
	};

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
	// console.log(chartLabel);
</script>

<Line {data} options={{ responsive: true }} />
