<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { AuthStore } from "../../store/authStore";
	import { authGuard, getUser } from "../../middleware/auth";
	import { AppBar } from "@skeletonlabs/skeleton";
  

  </script>
  
  <AppBar>
    Navbar
  
    <div class="flex-end">
   
    </div>

 
  </AppBar>
  