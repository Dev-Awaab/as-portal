<script>

	import AuthGuard from "$lib/components/common/AuthGuard.svelte";
	import Sidebar from "$lib/components/common/Sidebar.svelte";

</script>
<AuthGuard>
    <main class="w- h-auto">
      <div class=" flex">
        <!-- Sidebar -->
        <div class="file:">
          <Sidebar/>
        </div>
        
        <!-- Main Content -->
        <div class="w-screen px-2">
          <slot/>
        </div>
      <!-- </div> -->
      </main>
  </AuthGuard>