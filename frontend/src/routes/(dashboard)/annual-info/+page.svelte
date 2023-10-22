<script>
	import AnnualInfo from '$lib/components/annual_info/AnnualInfo.svelte';
</script>

<AnnualInfo />

<!-- <script>
    import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';

    const handleSubmit = () => {
        e.preventDefault()
    }
</script>


<main class="flex justify-center items-center mt-10 ">
    <Card class="w-full mx-auto max-w-2xl ">
        <form class="flex flex-col space-y-6" on:submit={handleSubmit}>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white ">Upload your Annual Information</h3>
            <Label class="space-y-2">
                <span>Inital Investment</span>
                <Input type="text" name="inital-investment" placeholder="Enter your targeted profit" required />
            </Label>
            <Label class="space-y-2">
                <span>Targeted Profit</span>
                <Input type="text" name="targeted-profit" placeholder="Enter your targeted profit" required />
            </Label>

            <Label class="space-y-2">
                <span>Year From</span>
                <Input type="date" name="yaer-from" placeholder="Year from" required />
            </Label>

            <Label class="space-y-2">
                <span>Year To</span>
                <Input type="date" name="year-to" placeholder="Year to" required />
            </Label>

            <div>
                <Button type="submit" class="w-full bg-blue-500 ">Submit</Button>
            </div>

        </form>
    </Card>
</main> -->
