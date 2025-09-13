<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🚘 Vehicle Info
    </h2>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Car:</span> {{ carBrand }} {{ carModel }} ({{ engineDisplacement }}L)
    </div>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Fuel Type:</span> {{ fuelType }}
    </div>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Drive Type:</span> {{ driveType }}
    </div>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Passengers:</span> {{ numberOfPeople }}
    </div>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Luggage:</span> {{ luggageWeight }} KG
    </div>
  </div>
</template>

<script>
export default {
  name: 'VehicleInfoCard',
  props: {
    carBrand: String,
    carModel: String,
    engineDisplacement: Number,
    fuelType: String,
    driveType: String,
    numberOfPeople: Number,
    luggageWeight: Number
  }
}
</script>
