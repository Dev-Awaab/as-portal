<script>
	import ComodityForm from '$lib/components/inventory/ComodityForm.svelte';
	import { scsnData, smazData, sprlData, ssbsData, ssgmData } from '$lib/components/inventory/data';
</script>

<div class="space-y-5">
	<ComodityForm comodityData={smazData} comodityName="SMAZ" />
	<ComodityForm comodityData={ssgmData} comodityName="SSGM" />
	<ComodityForm comodityData={ssbsData} comodityName="SSBS" />
	<ComodityForm comodityData={sprlData} comodityName="SPRL" />
	<ComodityForm comodityData={scsnData} comodityName="SCSN" />
</div>
