<script>
	import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { initalCapitalStore } from '../../../store';
	import CustomAlert from '$lib/components/common/CustomAlert.svelte';
	import Spinner from '../Spinner.svelte';

	let loading = false;
	let formData = {
		yearFrom: 2022,
		yearTo: 2023,
		initalCapital: 100,
		performanceTarget: 100
	};

	const handleSubmit = () => {
		//e.preventDefault()
		console.log('Form data:', formData);
		loading = true;
		initalCapitalStore.send(formData);
	};
</script>

<!-- {#if loading == true}
	<Spinner />
	{{loading = false}}
{/if} -->
<main class="flex justify-center items-center mt-10">
	<Card class="w-full mx-auto max-w-2xl ">
		<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">
				Upload your Annual Information
			</h3>
			<Label class="space-y-2">
				<span>Inital Investment</span>
				<Input
					type="text"
					name="inital-investment"
					placeholder="Enter your targeted profit"
					bind:value={formData.initalCapital}
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Targeted Profit</span>
				<Input
					type="text"
					name="targeted-profit"
					placeholder="Enter your targeted profit"
					bind:value={formData.performanceTarget}
					required
				/>
			</Label>

			<Label class="space-y-2">
				<span>Year From</span>
				<Input
					type="date"
					name="year-from"
					placeholder="Year from"
					bind:value={formData.yearFrom}
					required
				/>
			</Label>

			<Label class="space-y-2">
				<span>Year To</span>
				<Input
					type="date"
					name="year-to"
					placeholder="Year to"
					bind:value={formData.yearTo}
					required
				/>
			</Label>

			<div>
				<Button type="submit" class="w-full bg-blue-500 ">Submit</Button>
			</div>
		</form>
	</Card>
</main>
