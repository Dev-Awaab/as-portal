<script lang="ts">
	import { A,  Button, Card, Checkbox, Heading, Hr, Input, Label, Secondary } from "flowbite-svelte";
  import type {SignInValues} from '../../../app'
	import CustomAlert from "$lib/components/common/CustomAlert.svelte";
	import { useAuthStore } from "../../../store";
	import { goto } from "$app/navigation";
	import { userStore } from "../../../utils";
	import { onMount } from "svelte";

  const formData: SignInValues = {
    email: '',
    password: ''
  }


  let loading = false;
  let success = false;
  let error = false;
  let message: string | null = null;

  const unsubscribe = useAuthStore.subscribe((state) => {
		loading = state.loading;
		error = state.error;
		success = state.success;
    message = state.message
	});

  const onSubmit = async(e: Event) => {
    e.preventDefault()
    await useAuthStore.login(formData)
    if(success){
      window.location.assign('/')
    }
    showAlert();
  }



  let isAlertVisible = false;

  function showAlert() {
    isAlertVisible = true;
    setTimeout(() => {
      closeAlert();
    }, 3000);
  }

  function closeAlert() {
    isAlertVisible = false;
  }

  const user = $userStore
  onMount(() => {
     if(user) {
      window.location.assign('/')
    }
  })

  
</script>







<main class="flex items-center justify-center md:h-screen ">
  {#if isAlertVisible && success}
<CustomAlert  message="Logged in successfull" />
{/if}
{#if isAlertVisible && error}
<CustomAlert color="bg-red-300" {message} />
{/if}
 <Card class="w-full md:max-w-md">
    <div class="py-5 text-center">
      <Heading tag='h4' class="">Sign In</Heading>
    </div>
    <form on:submit|preventDefault={onSubmit}>
    
     
      <div class="mb-6">
        <Label for="email" class="mb-2">Email address</Label>
        <Input
         bind:value={formData.email}
        type="email" id="email" placeholder="john.doe@company.com" required />
      </div>
      <div class="mb-6">
        <Label for="password" class="mb-2">Password</Label>
        <Input
         bind:value={formData.password}
        type="password" id="password" placeholder="•••••••••" required />
      </div>
   
    
      <Button type="submit"
       
      class="bg-green-500 w-full">{loading ? 'loading...' : 'Sign In'}</Button>

      <Hr classHr="my-4" />

      <Secondary class="">
            Don't have an account? <A href="/sign-up" class="text-blue-500 underline">Sign Up</A>
      </Secondary>
    </form>
 </Card>
</main>