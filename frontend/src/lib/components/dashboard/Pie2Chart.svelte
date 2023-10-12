<script lang="ts">
	import { Pie } from 'svelte-chartjs';

	export var chartLabel: any[] = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];
	export var chartValues: any[] = [300, 50, 100, 40, 120];

	const data = {
		labels: chartLabel, //['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'],
		datasets: [
			{
				data: chartValues, //[300, 50, 100, 40, 120],
				backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#AC64AD'],
				hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#DA92DB']
			}
		]
	};

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<Pie {data} options={{ responsive: true }} />
