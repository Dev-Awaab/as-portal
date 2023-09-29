<script lang="ts">

	import { Toast } from "flowbite-svelte";
	import { CloseCircleSolid } from "flowbite-svelte-icons";

    export let color = "none"
    export let msg: string;

    let isVisible = true;

    setTimeout(() => {
      isVisible = false;
    }, 3000);
    

</script>

{#if isVisible}
<Toast color={color}>
    <svelte:fragment slot="icon">
      <CloseCircleSolid class="w-5 h-5" />
      <span class="sr-only">Error icon</span>
    </svelte:fragment>
    {msg}
  </Toast>
{/if}