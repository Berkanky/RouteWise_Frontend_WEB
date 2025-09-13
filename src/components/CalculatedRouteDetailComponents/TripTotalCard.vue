<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      💸 Total Cost
    </h2>
    <div class="text-2xl text-gray-900 font-bold">
      ${{ totalCost.toFixed(2) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripTotalCard',
  props: {
    totalCost: Number
  }
}
</script>