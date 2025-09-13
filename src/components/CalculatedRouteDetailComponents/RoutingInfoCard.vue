<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🧭 Routing Info
    </h2>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Travel Mode:</span> {{ travelMode }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Routing Preference:</span> {{ routingPreference }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Route Completed:</span>
      <span :class="isRouteCompleted ? 'text-green-600' : 'text-red-600'">
        {{ isRouteCompleted ? 'Yes' : 'No' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutingInfoCard',
  props: {
    travelMode: String,
    routingPreference: String,
    isRouteCompleted: Boolean
  }
}
</script>
