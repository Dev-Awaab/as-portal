<!-- <script lang="ts">
	import { Line } from 'svelte-chartjs';
	// import { data } from './data.js';
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
	import { onMount } from 'svelte';
	import { retrive } from '../../../utils';

	export var chartLabel: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	export var chartValues: any[] = [2000000, 1900000, 2500000, 2400000, 1800000, 1700000, 1400000]; // Loan Disbursed in NAIRA

	export let data = {
		labels: chartLabel, 
		datasets: [
			{
			label: 'Expected value',
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
			data: [2000000, 1900000, 2500000, 2400000, 1800000, 1700000, 1400000] // Loan Disbursed in NAIRA
		},
		{
			label: 'Portfolio Value',
			fill: true,
			lineTension: 0.3,
			backgroundColor: 'rgba(0, 0, 255, .3)', // Blue color
			borderColor: 'rgb(0, 0, 139)', // Slightly darker blue
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgb(35, 26, 136)',
			pointBackgroundColor: 'rgb(255, 255, 255)',
			pointBorderWidth: 10,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgb(0, 0, 0)',
			pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			data: [1500000, 1600000, 2000000, 2100000, 1600000, 1500000, 1200000]
		}
		]
	};



	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);


	

  onMount(async() => {
    const monthlyData = await retrive()

	console.log(monthlyData)

    // Extract dates, portfolio values, and performance target from the API response
    const dates = monthlyData.data.map((entry) => entry.DATE);
	console.log(dates)
    const portfolioValues = monthlyData.data.map((entry) => entry.PORTFOLIO_VALUE);
    const expectedValue = monthlyData.performaceTarget;

	console.log('expectedValue', expectedValue)

    // Update Svelte data with the extracted values
    $set(data, {
      ...data,
      labels: dates,
      datasets: [
        {
          ...data.datasets[0],
          data: Array(dates.length).fill(expectedValue),
        },
        {
          ...data.datasets[1],
          data: portfolioValues,
        },
      ],
    });
  });
</script>

<Line {data} options={{ responsive: true }} /> -->

<!-- <script lang="ts">
  import { Line } from 'svelte-chartjs';
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
  import { onMount } from 'svelte';
  import { retrive } from '../../../utils';



  export let data = {
    labels: [],
    datasets: [
      {
        label: 'Expected value',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(255, 165, 0, .3)',
        borderColor: 'rgb(255, 140, 0)',
        data: [], // Placeholder for now
      },
      {
        label: 'Portfolio Value',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(0, 0, 255, .3)',
        borderColor: 'rgb(0, 0, 139)',
        data: [], // Placeholder for now
      },
    ],
  };

  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

  onMount(async () => {
    const monthlyData = await retrive();

    // Extract dates, portfolio values, and performance target from the API response
    const dates = monthlyData.data.map((entry) => entry.DATE);
    const portfolioValues = monthlyData.data.map((entry) => entry.PORTFOLIO_VALUE);
    const expectedValue = monthlyData.data.performaceTarget;

    // Update Svelte data with the extracted values
    data.labels = dates;
    data.datasets[0].data = Array(dates.length).fill(expectedValue);
    data.datasets[1].data = portfolioValues;
  });

  console.log(data)
</script>

<Line {data} options={{ responsive: true }} /> -->

<script lang="ts">
	import { Line } from 'svelte-chartjs';
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
	import { onMount } from 'svelte';
	import { retrive } from '../../../utils';

	export let data = {
		labels: [],
		datasets: [
			{
				label: 'Expected value',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(255, 255, 255, .3)',
				borderColor: 'rgb(255, 140, 0)',
				data: [] // Placeholder for now
			},
			{
				label: 'Portfolio Value',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(0, 0, 255, .3)',
				borderColor: 'rgb(0, 0, 139)',
				data: [] // Placeholder for now
			}
		]
	};

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	onMount(async () => {
		const monthlyData = await retrive();

		// Extract dates, portfolio values, and performance target from the API response
		const dates = monthlyData.data.map((entry) => entry.DATE);
		const portfolioValues = monthlyData.data.map((entry) => entry.PORTFOLIO_VALUE);
		const expectedValue = monthlyData.expectedValue;

		// Update Svelte data with the extracted values
		data.labels = dates;
		data.datasets[0].data = Array(dates.length).fill(expectedValue);
		data.datasets[1].data = portfolioValues;

		console.log(data); // Move inside onMount block
	});
</script>

<Line {data} options={{ responsive: true }} />
