<script lang="ts">
	import Chart from 'chart.js/auto';

	export var ChartDataSet: any[] = [];
	export var chartID = 'bar_chart';
	var DemoBarChart;
	var rows: any = [];
	var data: any;

	/** @type {import('svelte/action').Action}  */
	function DisplayBarChart(node: any) {
		if (ChartDataSet != null) {
			for (var i = 0; i < ChartDataSet.length; i += 1) {
				var rowObject;
				rowObject = { DATE: ChartDataSet[i].x, BALANCE: ChartDataSet[i].y };
				rows.push(rowObject);
			}

			data = {
				labels: rows.map((row: any) => row.DATE),
				datasets: [
					{
						label: 'Monthly Revnue',
						data: rows.map((row: any) => row.BALANCE)
					}
				]
			};
		}

		const ctx = document.getElementById(chartID) as HTMLCanvasElement;
		DemoBarChart = new Chart(ctx, {
			type: 'bar',
			data,
			options: {
				animation: false,
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});

		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}
</script>

<div class="w-full h-auto">
	<canvas id={chartID} use:DisplayBarChart />
</div>
