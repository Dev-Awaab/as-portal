<!-- Modal.svelte -->
<script lang="ts">
  import { Modal } from 'flowbite-svelte';

  export let open = false;
  export let onClose: () => void;
  export let title = 'Modal Title';

  function closeModal() {
    open = false;
    onClose();
  }
</script>

{#if open}
  <Modal bind:open={open} size="xs" autoclose={false} class="w-full">
    <div class="p-2">
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
       
      <slot></slot>
      <!-- <div class="mt-6 flex justify-end">
        <button on:click={closeModal} class="text-primary-500 hover:underline">Close</button>
      </div> -->
    </div>
  </Modal>
{/if}
