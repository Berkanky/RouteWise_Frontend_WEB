<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      📍 Locations (Encrypted)
    </h2>

    <div class="text-sm text-gray-700 break-all">
      <span class="font-medium">Start:</span> {{ startLocation }}
    </div>

    <div class="text-sm text-gray-700 break-all">
      <span class="font-medium">Destination:</span> {{ destinationLocation }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationDetails',
  props: {
    startLocation: String,
    destinationLocation: String
  }
}
</script>
