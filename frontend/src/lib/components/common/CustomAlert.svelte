<script lang="ts">
    export let message: string | null;
    export let color = "bg-green-300";
   
  </script>
  

    <div class="fixed top-0  right-0 py-4 px-10 m-4 text-white rounded-lg  transition duration-300 transform translate-y-0 opacity-100 {color}">
      <p class="text-xl tracking-wider">
        {message}
      </p>
    </div> 

  