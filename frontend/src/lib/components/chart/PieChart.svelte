<script lang="ts">
	import Chart, { elements } from 'chart.js/auto';
	import type { AngleTopOutline } from 'flowbite-svelte-icons';

	export var ChartDataSet: any[] = [];
	export var commodities: string[];
	var DemoPieChart;
	var commodityDistribution: any = {};
	var VolumeData: any[] = [];

	function filterCommodity() {
		const arrayWithDuplicateCommodity: any = [];

		ChartDataSet.forEach((element: any) => {
			arrayWithDuplicateCommodity.push(element.commodity);
		});

		const uniqueSet = new Set(arrayWithDuplicateCommodity);
		const uniqueArray: any = Array.from(uniqueSet);

		console.log('Displaying Array with duplicate Commodity', arrayWithDuplicateCommodity);
		console.log('New Set ', uniqueArray);
		commodities = [...uniqueArray];
	}

	/** @type {import('svelte/action').Action}  */
	function DisplayPieChart(node: any) {
		filterCommodity();
		for (var i = 0; i < ChartDataSet.length; i++) {
			var loopCommodity = ChartDataSet[i].commodity;
			if (commodityDistribution[loopCommodity] == null) {
				commodityDistribution[loopCommodity] = ChartDataSet[i].y;
			} else {
				var current = commodityDistribution[loopCommodity];
				commodityDistribution[loopCommodity] = current + ChartDataSet[i].y;
			}
		}

		if (ChartDataSet != null) {
			for (var i = 0; i < commodities.length; i++) {
				var currentCommodity = commodityDistribution[commodities[i]];
				if (currentCommodity != null) VolumeData.push(currentCommodity);
				else VolumeData.push(0);
			}
		}

		// console.log(commodities);
		// console.log(VolumeData);
		let data = {
			labels: [...commodities],
			datasets: [
				{
					//data: [30, 40, 20, 10],
					data: VolumeData
					// backgroundColor: ['#FF5733', '#337BFF', '#FFD700', '#FFD210']
				}
			]
		};

		const ctx = document.getElementById('piechart') as HTMLCanvasElement;
		DemoPieChart = new Chart(ctx, {
			type: 'pie',
			data,
			options: {}
		});
		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}
</script>

{#key ChartDataSet}
	<div class="w-full h-[400px] flex items-center justify-center mx-auto">
		<canvas id="piechart" use:DisplayPieChart />
	</div>
{/key}
