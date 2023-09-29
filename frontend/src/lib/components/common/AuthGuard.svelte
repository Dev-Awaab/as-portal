<script lang="ts">
	import { onMount } from "svelte";
	import { userStore } from "../../../utils";
	import { goto } from "$app/navigation";

    let isAuthenticated = false;

    onMount(() => {
       isAuthenticated = $userStore;

       if(!isAuthenticated){
         goto('/sign-in')
       }

    })
</script>

{#if isAuthenticated}
<slot/>
{/if}