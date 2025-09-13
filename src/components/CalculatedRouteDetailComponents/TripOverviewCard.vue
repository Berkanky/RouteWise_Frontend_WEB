<template>
    <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🚗 Trip Overview
        </h2>

        <div class="text-sm text-gray-700 flex items-center gap-2">
            📏 <span class="font-medium">Distance:</span>
            {{ formattedDistance }}
        </div>

        <div class="text-sm text-gray-700 flex items-center gap-2">
            ⏱️ <span class="font-medium">Duration:</span> {{ duration }}
        </div>

        <div class="text-sm text-gray-700 flex items-center gap-2">
            🗓️ <span class="font-medium">Created:</span> {{ formattedDate }}
        </div>
    </div>
</template>

<script>
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
    name: 'TripOverviewCard',
    props: {
        distanceKm: {
            type: Number,
            required: true
        },
        distanceMi: {
            type: Number,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        createdDate: {
            type: String,
            required: true
        }
    },
    computed: {
        formattedDistance() {
            return `${this.distanceKm.toFixed(1)} KM / ${this.distanceMi.toFixed(2)} MI`
        },
        formattedDate() {
            const date = new Date(this.createdDate)
            return format(date, 'dd MMMM yyyy', { locale: tr })
        }
    }
}
</script>
