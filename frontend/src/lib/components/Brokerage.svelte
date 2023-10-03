<script lang="ts">
    import {
      Heading,
      Table,
      TableBody,
      TableBodyCell,
      TableBodyRow,
      TableHead,
      TableHeadCell
    } from 'flowbite-svelte';
  
    // Sample data for Brokerage Fee Earned
    const data = [
      { month: 'Nov-22', amount: '₦ 2,376,779.08' },
      { month: 'Dec-22', amount: '₦ 2,351,498.82' },
      { month: 'Jan-23', amount: '₦ 1,150,778.18' },
      { month: 'Feb-23', amount: '₦ 3,680,033.67' },
      { month: 'Mar-23', amount: '₦ 2,179,627.64' },
      { month: 'Apr-23', amount: '₦ 1,104,471.00' },
      { month: 'May-23', amount: '₦ 908,946.45' },
      { month: 'Jun-23', amount: '₦ 295,982.67' }
    ];
  
    // Calculate the total sum of amounts
    const total = data.reduce((acc, item) => acc + parseInt(item.amount.replace(/\D/g, '')), 0);

  </script>
  
  <div>
    <div class="flex items-center py-5 px-3">
      <Heading tag="h5">Brokerage Fee Earned</Heading>
    </div>
    <Table class="w-full">
      <TableHead defaultRow={false} class="w-full">
        <tr class="w-full">
          <TableHeadCell>Month</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody class="divide-y">
        {#each data as item (item.month)}
          <TableBodyRow>
            <TableBodyCell>{item.month}</TableBodyCell>
            <TableBodyCell>{item.amount}</TableBodyCell>
          </TableBodyRow>
        {/each}
        <TableBodyRow>
          <TableBodyCell>Total</TableBodyCell>
          <TableBodyCell>₦ {total.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
  </div>
  