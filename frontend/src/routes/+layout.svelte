<script>
	import Navbar from '$lib/components/common/Navbar.svelte';
import '../app.postcss';
</script>

<div >

<Navbar/>
	<main>
		<slot />
	</main>

</div>
<!-- <Toast/> -->
