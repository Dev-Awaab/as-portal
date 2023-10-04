<script lang="ts">
	import Brokerage from '$lib/components/Brokerage.svelte';
	import PortfoliValues from '$lib/components/PortfoliValues.svelte';
	import WeeklyFigure from '$lib/components/WeeklyFigure.svelte';
</script>

<main class="px-2 my-10 space-y-10">
	<div>
		<WeeklyFigure />
	</div>

	<div>
		<PortfoliValues />
	</div>
	<div>
		<Brokerage />
	</div>
</main>
