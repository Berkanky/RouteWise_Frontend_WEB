<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-zinc-100 print:hidden">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button type="button" @click="goBack()"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]">
          <svg viewBox="0 0 24 24" class="h-5 w-5">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div>
          <h1 class="text-[15px] sm:text-[16px] font-semibold text-zinc-900">Route detail</h1>
          <p class="text-[12px] text-zinc-500 leading-none">
            <span class="font-mono">{{ calculated_route_detail?._id || '—' }}</span>
          </p>
        </div>
      </div>
    </div>
  </header>
  <section
    class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6 pb-[calc(96px+max(env(safe-area-inset-bottom),0px))] sm:pb-8">
    <div v-if="isLoading" class="py-10 grid gap-4">
      <div class="h-20 rounded-xl bg-zinc-100 animate-pulse"></div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
      </div>
      <div class="h-80 rounded-xl bg-zinc-100 animate-pulse"></div>
    </div>
    <div v-else-if="errorMessage" class="mt-6">
      <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        {{ errorMessage }}
      </div>
    </div>
    <div v-else class="space-y-6 sm:space-y-8">
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm p-4 sm:p-5 no-overflow">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-[18px] sm:text-[20px] font-semibold text-zinc-900">
              {{ calculated_route_detail?.Name || 'Route' }} <span class="text-zinc-400">/</span>
              <span class="text-zinc-700">{{ vehicleLabel }}</span>
            </h2>
            <p class="text-[13px] text-zinc-500">
              {{ calculated_route_detail?.Description || '—' }}
            </p>
          </div>
          <div class="flex flex-col sm:items-end gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[12px] text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor" d="M17 9h-7V7h7m0 4h-7v-2h7m0 4h-7v-2h7M3 5h2v14H3z" />
                </svg>
                {{ calculated_route_detail?.RoutingPreference || '—' }}
              </span>
              <span
                class="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[12px] text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor" d="M12 2 2 7l10 5 10-5-10-5Zm0 20L2 17v-7l10 5 10-5v7l-10 5Z" />
                </svg>
                {{ calculated_route_detail?.TravelMode || '—' }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50
                 px-2.5 py-1.5 text-[12px] text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor"
                    d="M12 8a1 1 0 0 1 1 1v3.59l2.3 2.3-1.42 1.42L11 13.41V9a1 1 0 0 1 1-1Zm0-6a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                </svg>
                <span class="text-zinc-600">Requested:</span>
                <span class="font-mono tabular-nums font-medium text-zinc-800 whitespace-nowrap">
                  {{ this.calculated_route_detail?.request_date }}
                </span>
              </span>
              <span class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50
                 px-2.5 py-1.5 text-[12px] text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor" d="M19 3H5v18l7-3 7 3V3Z" />
                </svg>
                <span class="text-zinc-600">Created:</span>
                <span class="font-mono tabular-nums font-medium text-zinc-800 whitespace-nowrap">
                  {{ this.calculated_route_detail?.CreatedDate }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm p-4 sm:p-5 no-overflow">
        <!-- Header -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700">
              <svg viewBox="0 0 24 24" class="h-5 w-5">
                <path fill="currentColor"
                  d="M3 3h10v18H3V3Zm12 3h2l3 3v8a3 3 0 0 1-6 0V9h1v8a2 2 0 1 0 4 0V9.83L17.17 8H15V6Z" />
              </svg>
            </span>
            <div class="min-w-0">
              <h3 class="text-[14px] font-semibold text-zinc-900">Fuel pricing basis</h3>
              <p class="text-[12px] text-zinc-500 truncate">
                Fuel price and period used in cost calculations
              </p>
            </div>
          </div>

          <div class="hidden sm:flex sm:flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.fueltype1 || calculated_route_detail?.FuelTypeDetail || '—' }}
            </span>
          </div>
        </div>

        <!-- 3 Columns -->
        <div
          class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4
           sm:[&>*:not(:first-child)]:pl-4 sm:[&>*:not(:first-child)]:border-l sm:[&>*:not(:first-child)]:border-zinc-100">
          <div class="min-w-0">
            <p class="text-[11px] text-zinc-500">Price</p>
            <p class="tabular-nums tracking-tight text-[18px] font-semibold text-zinc-900 leading-tight">
              {{ calculated_route_detail?.FuelPriceAtTransactionTime || '—' }}
            </p>
          </div>

          <div class="min-w-0">
            <p class="text-[11px] text-zinc-500">Units</p>
            <p class="text-[16px] font-semibold text-zinc-900 leading-snug">
              {{ calculated_route_detail?.FuelPriceUnits || '—' }}
            </p>
          </div>

          <div class="min-w-0">
            <p class="text-[11px] text-zinc-500">Period</p>
            <p class="font-mono tabular-nums text-[13px] text-zinc-900 leading-snug">
              {{ calculated_route_detail?.FuelPricePeriod || '—' }}
            </p>
          </div>
        </div>

        <!-- Divider -->
        <div class="mt-3 h-px bg-zinc-50"></div>

        <!-- Pricing Source -->
        <p class="mt-2 text-[11px] text-zinc-500">
          Pricing source:
          <span class="font-mono tabular-nums text-zinc-700">
            {{ calculated_route_detail?.FuelPriceAtTransactionTime }}
          </span>
          <span class="mx-1 text-zinc-300">/</span>
          <span class="font-mono tabular-nums text-zinc-700">
            {{ calculated_route_detail?.FuelPriceUnits }}
          </span>
          <span class="mx-1 text-zinc-300">•</span>
          <span class="font-mono tabular-nums text-zinc-700">
            {{ calculated_route_detail?.FuelPricePeriod }}
          </span>
        </p>

        <!-- NEW: Liter Basis -->
        <p class="mt-1 text-[11px] text-zinc-500">
          Liter basis:
          <span class="font-mono tabular-nums text-zinc-700">
            {{ calculated_route_detail?.FuelLiterPriceAtTransactionTime?.formatted_liter || '—' }}
          </span>
        </p>
      </div>

      <div class="rounded-2xl border border-zinc-100 bg-white p-4 lg:p-5 shadow-sm overflow-hidden no-overflow">
        <div class="mb-1 flex items-center justify-between">
          <h3 class="text-[13px] font-semibold text-zinc-900">Route Summary</h3>
          <div class="relative">
            <select v-model="selected_currency" @change="on_currency_change($event.target.value)" class="block w-full appearance-none rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-1.5
           text-[11px] text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-300
           hover:bg-zinc-50 cursor-pointer">
              <option disabled value="">Select Currency</option>

              <option v-for="c in avaliable_currencies" :key="c.CurrencyCode" :value="c.CurrencyCode">
                {{ c.CurrencyCode }} - {{ c.Name }}
              </option>
            </select>

            <div class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-zinc-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div v-if="Object.keys(this.calculate_currency_service_fx_data).length"
          class="mt-3 mb-4 rounded-md bg-zinc-50 border border-zinc-200 px-3 py-1.5 text-[10px] text-zinc-500">
          <div class="flex flex-wrap gap-x-6 gap-y-1">
            <span>
              <span class="font-medium text-zinc-700">Period: </span>
              <span class="text-zinc-600"> {{ this.calculate_currency_service_fx_data.period }} </span>
            </span>

            <span>
              <span class="font-medium text-zinc-700">Base / Target: </span>
              <span class="text-zinc-600"> {{ this.calculate_currency_service_fx_data.base_currency }} / {{
                this.calculate_currency_service_fx_data.target_currency }} </span>
            </span>

            <span>
              <span class="font-medium text-zinc-700">Rate: </span>
              <span class="text-zinc-600"> {{ this.calculate_currency_service_fx_data.formatted_rate }} </span>
            </span>

            <span>
              <span class="font-medium text-zinc-700">Requested At: </span>
              <span class="text-zinc-600"> {{ this.calculate_currency_service_fx_data.request_date }} </span>
            </span>
          </div>
        </div>
        <div class="divide-y divide-zinc-100">
          <section v-for="(each_created_polyline, key) in calculated_route_detail.decrypted_calculated_route_polylines"
            :key="key" class="relative py-3 lg:py-4 pr-4">
            <div class="pointer-events-none absolute right-0 top-0 h-full w-[4px] rounded-r-md" :style="{
              background: `linear-gradient(to bottom,
                transparent 0%,
                ${each_created_polyline?.StrokeColor || '#ccc'} 35%,
                ${each_created_polyline?.StrokeColor || '#ccc'} 65%,
                transparent 100%)
              `
            }"></div>
            <div class="mb-2">
              <span
                class="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-50/60 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                Route #{{ key + 1 }}
              </span>
              <span v-if="each_created_polyline?.Name" class="ml-2 text-[11px] text-zinc-500">
                {{ each_created_polyline.Name }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-y-2 md:gap-4
               md:[&>*:not(:first-child)]:pl-4 md:[&>*:not(:first-child)]:border-l md:[&>*:not(:first-child)]:border-zinc-100
               grid-print-block">
              <div class="min-w-0 no-break">
                <p class="text-[11px] text-zinc-500">Distance</p>
                <p class="tabular-nums tracking-tight text-[18px] font-semibold text-zinc-900 leading-tight">
                  {{ each_created_polyline?.DistanceKM }}
                  <span class="text-[11px] font-normal text-zinc-500">km</span>
                </p>
                <p class="tabular-nums text-[11px] text-zinc-500">
                  {{ each_created_polyline?.DistanceMIL }} mi
                </p>
              </div>
              <div class="min-w-0 no-break">
                <p class="text-[11px] text-zinc-500">ETA</p>
                <p class="text-[16px] lg:text-[17px] font-semibold text-zinc-900 leading-snug">
                  {{ each_created_polyline?.AverageDestinationTimeFormatted || '—' }}
                </p>
              </div>
              <div class="min-w-0 no-break">
                <p class="text-[11px] text-zinc-500">Fuel Consumption</p>
                <p class="tabular-nums tracking-tight text-[18px] font-semibold text-zinc-900 leading-tight">
                  {{ each_created_polyline?.TotalGallon }}
                  <span class="text-[11px] font-normal text-zinc-500">gal</span>
                  <span class="mx-1.5 text-zinc-300">•</span>
                  {{ each_created_polyline?.TotalLiter?.liter }}
                  <span class="text-[11px] font-normal text-zinc-500">L</span>
                </p>
              </div>
              <div class="min-w-0 no-break">
                <p class="text-[11px] text-zinc-500">Cost</p>
                <p class="tabular-nums tracking-tight text-[18px] font-semibold text-zinc-900 leading-tight">
                  {{ each_created_polyline?.TotalCost || '—' }}
                </p>
                <div class="my-[6px] h-px bg-zinc-50"></div>
                <div class="text-[11px] text-zinc-500 space-y-1">
                  <div class="grid grid-cols-[auto_auto] justify-between">
                    <span class="truncate">Fuel</span>
                    <span class="tabular-nums"> {{ each_created_polyline?.TotalGallonCost }}</span>
                  </div>
                  <div class="grid grid-cols-[auto_auto] justify-between">
                    <span class="truncate">Tolls</span>
                    <span class="tabular-nums"> {{ each_created_polyline?.TollRoadEstimatedPriceDollar }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm no-overflow">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Start</h3>
          <div class="text-[13px] text-zinc-700">
            <p class="font-medium">{{ calculated_route_detail?.StartLocation || '—' }}</p>
            <div class="mt-2 grid grid-cols-3 gap-2 text-[12px] text-zinc-500">
              <div>
                <span class="text-zinc-400">Locality</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.locality || '—' }}
                </div>
              </div>
              <div>
                <span class="text-zinc-400">State</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.state || '—' }}</div>
              </div>
              <div>
                <span class="text-zinc-400">Country</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.country || '—' }}
                </div>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[12px] text-zinc-500">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  class="w-4 h-4 text-zinc-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.458 12C3.732 6.943 7.428 3 12 3c4.572 0 8.268 3.943 9.542 9H2.458Z" />
                </svg>
                <div>
                  <span class="text-zinc-400">Latitude</span>
                  <div>{{ calculated_route_detail?.StartLocationLatitude?.toFixed(6) || '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  class="w-4 h-4 text-zinc-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 21c-4.418 0-8-3.582-8-8a8 8 0 1 1 16 0c0 4.418-3.582 8-8 8Z" />
                  <circle cx="12" cy="13" r="2" stroke-width="1.5" />
                </svg>
                <div>
                  <span class="text-zinc-400">Longitude</span>
                  <div>{{ calculated_route_detail?.StartLocationLongitude?.toFixed(6) || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm no-overflow">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Destination</h3>
          <div class="text-[13px] text-zinc-700">
            <p class="font-medium">{{ calculated_route_detail?.DestinationLocation || '—' }}</p>
            <div class="mt-2 grid grid-cols-3 gap-2 text-[12px] text-zinc-500">
              <div>
                <span class="text-zinc-400">Locality</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.locality || '—'
                }}
                </div>
              </div>
              <div>
                <span class="text-zinc-400">State</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.state || '—' }}
                </div>
              </div>
              <div>
                <span class="text-zinc-400">Country</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.country || '—'
                }}
                </div>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[12px] text-zinc-500">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  class="w-4 h-4 text-zinc-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.458 12C3.732 6.943 7.428 3 12 3c4.572 0 8.268 3.943 9.542 9H2.458Z" />
                </svg>
                <div>
                  <span class="text-zinc-400">Latitude</span>
                  <div>{{ calculated_route_detail?.DestinationLocationLatitude?.toFixed(6) || '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  class="w-4 h-4 text-zinc-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 21c-4.418 0-8-3.582-8-8a8 8 0 1 1 16 0c0 4.418-3.582 8-8 8Z" />
                  <circle cx="12" cy="13" r="2" stroke-width="1.5" />
                </svg>
                <div>
                  <span class="text-zinc-400">Longitude</span>
                  <div>{{ calculated_route_detail?.DestinationLocationLongitude?.toFixed(6) || '—' }}</div>
                </div>
              </div>
            </div>
            <div v-if="calculated_route_detail?.DestinationLocationDetail?.error"
              class="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">
              <strong class="font-semibold">Address warning:</strong>
              {{ calculated_route_detail?.DestinationLocationDetail?.error }}
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm no-overflow">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[14px] font-semibold text-zinc-900">Toll passes</h3>
            <span class="text-[12px] text-zinc-500">
              {{ (calculated_route_detail?.TollPass || []).length }} item
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2
             sm:[grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))] sm:gap-2">
            <span v-for="(tp, i) in (calculated_route_detail?.TollPass || [])" :key="i" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50
               px-2.5 py-1.5 text-[12px] text-zinc-700 w-full min-w-0 overflow-hidden">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full"
                :style="{ backgroundColor: i % 2 === 0 ? '#ef4444' : '#111827' }"></span>
              <span class="truncate max-w-full whitespace-nowrap">{{ prettyToll(tp) }}</span>
            </span>
            <span v-if="!(calculated_route_detail?.TollPass || []).length"
              class="text-[13px] text-zinc-500 col-span-2 sm:col-[1/-1]">
              No passes
            </span>
          </div>
        </div>
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm no-overflow">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Trip options</h3>
          <ul class="space-y-2 text-[13px] text-zinc-700">
            <li class="flex items-center justify-between">
              <span class="text-zinc-500">Drive type</span>
              <span class="inline-flex items-center gap-1 rounded-md border px-2 py-1" :class="drivePillClass">
                {{ calculated_route_detail?.DriveType || '—' }}
              </span>
            </li>
            <li class="flex items-center justify-between">
              <span class="text-zinc-500">People</span>
              <span class="font-medium">{{ calculated_route_detail?.NumberOfPeople ?? '—' }}</span>
            </li>
            <li class="flex items-center justify-between">
              <span class="text-zinc-500">Luggage</span>
              <span class="font-medium">
                <span>{{ calculated_route_detail?.LuggageWeight }}</span>
                <span class="text-zinc-500"> kg</span>
                <span class="mx-1 text-zinc-300">•</span>
                <span>{{ calculated_route_detail.LuggageWeightPound }}</span>
                <span class="text-zinc-500"> lb</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="rounded-2xl border border-zinc-100 bg-white p-4 sm:p-5 shadow-sm print-keep print-overflow-visible no-overflow">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-semibold text-zinc-900">Vehicle</h3>
          <div
            class="hidden sm:flex items-center gap-2 print-block print:[grid-template-columns:repeat(2,minmax(0,1fr))]">
            <span v-if="calculated_route_detail?.VehicleId?.drive"
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.drive }}
            </span>
            <span v-if="calculated_route_detail?.VehicleId?.trany"
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.trany }}
            </span>
            <span
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.FuelTypeDetail }}
            </span>
            <span v-if="calculated_route_detail?.VehicleId?.fueltype"
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.fueltype }}
            </span>
            <span
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.FuelPriceUnits }}
            </span>
          </div>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 grid-print-block">
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Make</dt>
            <dd class="text-[13px] font-medium text-zinc-900">{{ calculated_route_detail?.VehicleId?.make || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Model</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.model
              || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Base Model</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.basemodel
              || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Year</dt>
            <dd class="text-[13px] font-medium text-zinc-900 tabular-nums">{{ calculated_route_detail?.VehicleId?.year
              || '—' }}</dd>
          </div>

          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Cylinders</dt>
            <dd class="text-[13px] font-medium text-zinc-900 tabular-nums">{{
              calculated_route_detail?.VehicleId?.cylinders || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Displacement</dt>
            <dd class="text-[13px] font-medium text-zinc-900">
              <span class="tabular-nums">{{ calculated_route_detail?.VehicleId?.displ ?? '—' }}</span>
              <span v-if="calculated_route_detail?.VehicleId?.displ" class="ml-1 text-zinc-500 text-[12px]">L</span>
            </dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Transmission</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.trany ||
              '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Drive</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.drive ||
              '—' }}</dd>
          </div>

          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Fuel Type</dt>
            <dd class="text-[13px] font-medium text-zinc-900">{{ calculated_route_detail?.VehicleId?.fueltype || '—' }}
            </dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Fuel Type 1</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.fueltype1
              || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Vehicle Class</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.vclass ||
              '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">MPG</dt>
            <dd class="text-[13px] font-medium text-zinc-900">
              <span class="inline-flex items-baseline gap-1">
                <b class="text-[14px] tabular-nums">{{ calculated_route_detail?.VehicleId?.city08 ?? '—' }}</b>
                <span class="text-[11px] text-zinc-500">City</span>
              </span>
              <span class="mx-2 text-zinc-300">/</span>
              <span class="inline-flex items-baseline gap-1">
                <b class="text-[14px] tabular-nums">{{ calculated_route_detail?.VehicleId?.comb08 ?? '—' }}</b>
                <span class="text-[11px] text-zinc-500">Comb</span>
              </span>
              <span class="mx-2 text-zinc-300">/</span>
              <span class="inline-flex items-baseline gap-1">
                <b class="text-[14px] tabular-nums">{{ calculated_route_detail?.VehicleId?.highway08 ?? '—' }}</b>
                <span class="text-[11px] text-zinc-500">Hwy</span>
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden print:hidden">
        <div class="px-4 pt-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="inline-flex items-center gap-2">
              <span class="text-[13px] text-zinc-600">Alternatif rota</span>
              <span
                class="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[12px] text-zinc-800">
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
                  <path fill="currentColor" d="M4 6h16v2H4zm0 5h10v2H4zm0 5h16v2H4z" />
                </svg>
                <b class="tabular-nums">
                  {{ this.calculated_route_detail.NumberOfMultipleRoute }}
                </b>
                <span class="text-zinc-500">period</span>
              </span>
            </div>
          </div>
        </div>
        <GoogleMaps :build_route_button_triggered="this.build_route_button_triggered" />
      </div>

      <div class="rounded-2xl border border-zinc-100 bg-white p-4 sm:p-6 shadow-sm">

        <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div class="min-w-0">
            <h3 class="text-[14px] font-semibold text-zinc-900">Share Link</h3>
            <p class="text-[12px] text-zinc-500">Create a shareable link for this route.</p>
          </div>

          <span class="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] whitespace-nowrap"
            :class="share_route_service_started === true
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'">
            <svg viewBox="0 0 24 24" class="h-4 w-4"
              :class="share_route_service_started === true ? 'animate-pulse' : ''">
              <path fill="currentColor" :d="share_route_service_started === true
                ? 'M12 2a10 10 0 1 0 10 10h-2A8 8 0 1 1 12 4V2Z'
                : 'M9 16.17 5.53 12.7l-1.41 1.41L9 19 20.29 7.71 18.88 6.3 9 16.17Z'" />
            </svg>
            <span>{{ share_route_service_started === true ? 'Processing...' : 'Ready' }}</span>
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:gap-6">

          <div class="rounded-xl border border-zinc-100 bg-white p-4 sm:p-5">
            <h4 class="text-[13px] font-semibold text-zinc-900 mb-3">Action</h4>

            <button type="button" @click="share_route_service(2)"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 px-3 py-2.5 text-[13px] font-semibold hover:bg-indigo-100 active:scale-[0.99] disabled:opacity-60"
              :disabled="share_route_service_started === true">
              <svg viewBox="0 0 24 24" class="h-4 w-4">
                <path fill="currentColor"
                  d="M10.59 13.41a1.98 1.98 0 0 1 0-2.82l2.82-2.82a2 2 0 1 1 2.83 2.83l-.88.88 1.41 1.41.88-.88a4 4 0 1 0-5.66-5.66l-2.82 2.82a4 4 0 0 0 0 5.66l.42.42 1.41-1.41-.41-.41Z" />
                <path fill="currentColor"
                  d="M13.41 10.59a1.98 1.98 0 0 1 0 2.82l-2.82 2.82a2 2 0 1 1-2.83-2.83l.88-.88-1.41-1.41-.88.88a4 4 0 1 0 5.66 5.66l2.82-2.82a4 4 0 0 0 0-5.66l-.42-.42-1.41 1.41.41.41Z" />
              </svg>
              Create / Refresh Share Link
            </button>

            <div class="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
              <div class="flex flex-wrap items-center gap-2 text-[12px]">
                <span class="inline-flex h-2 w-2 rounded-full"
                  :class="share_route_service_started === true ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'"></span>
                <span class="text-zinc-700">
                  {{ share_route_service_started === true
                    ? 'Process started. Please wait until it finishes...'
                    : 'Process completed. If a link exists, it appears below.' }}
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-zinc-100 bg-white p-4 sm:p-5">
            <h4 class="text-[13px] font-semibold text-zinc-900 mb-3">Shared Link</h4>

            <div v-if="calculated_route_detail?.shared_link?.formatted_url"
              class="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-zinc-100 p-3 sm:p-4">
              <div class="flex items-start gap-3 min-w-0">
                <span
                  class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 shrink-0"
                  title="Link">
                  <svg viewBox="0 0 24 24" class="h-5 w-5">
                    <path fill="currentColor"
                      d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1h3V6H8A6 6 0 0 0 8 18h3v-1.9H8A4.1 4.1 0 0 1 3.9 12Zm7-1h-3v2h3v-2Zm1 1a4.1 4.1 0 0 1 4.1-4.1H19A6 6 0 1 1 19 18h-3v-1.9h3A4.1 4.1 0 0 0 12.9 12Z" />
                  </svg>
                </span>
                <div class="min-w-0">
                  <div class="text-[13px] sm:text-[14px] font-semibold text-zinc-900 truncate">
                    Public Share URL
                  </div>
                  <div class="mt-1 text-[12px] text-zinc-600 flex flex-wrap gap-1">
                    <span class="text-zinc-500 shrink-0">URL:</span>
                    <a class="truncate underline decoration-dotted hover:opacity-80 break-all"
                      :href="calculated_route_detail.shared_link.formatted_url" target="_blank" rel="noopener">
                      Visit Link
                    </a>
                  </div>
                  <div class="mt-1 text-[12px] text-zinc-600 flex flex-wrap gap-1">
                    <span class="text-zinc-500 shrink-0">Expires At:</span>
                    <span class="font-mono tabular-nums break-all">
                      {{ calculated_route_detail.shared_link.ExpiresDate || '—' }}
                    </span>
                  </div>
                  <div class="mt-1 text-[12px] text-zinc-600 flex flex-wrap gap-1">
                    <span class="text-zinc-500 shrink-0">Access request:</span>
                    <span class="font-mono tabular-nums break-all">
                      {{ calculated_route_detail?.shared_link?.AccessCount || '—' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
                <button type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-[13px] font-semibold hover:bg-zinc-50 active:scale-[0.99]"
                  @click="copySharedLink">
                  <svg viewBox="0 0 24 24" class="h-4 w-4">
                    <path fill="currentColor"
                      d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
                  </svg>
                  Copy
                </button>
              </div>
            </div>

            <div v-else class="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-[12px] text-zinc-600 mt-3">
              No shared link created yet. Use the button above to create one.
            </div>
          </div>
        </div>
      </div>

      <div
        class="sm:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] print:hidden">
        <div class="mx-auto max-w-6xl">
          <div class="rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur
                shadow-lg px-3 py-2 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <span class="inline-flex h-2 w-2 rounded-full"
                :style="{ backgroundColor: calculated_route_detail?.StrokeColor || '#111827' }"></span>
              <span class="text-[13px] text-zinc-700 truncate pr-2">
                {{ calculated_route_detail?.StartLocation }} → {{ calculated_route_detail?.DestinationLocation }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="delete_calculated_route(calculated_route_detail._id)" type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-rose-600 text-rose-700 px-3 py-2 text-[13px] font-semibold hover:bg-rose-50 active:scale-[0.99]">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden sm:block sticky bottom-3 z-30 print:hidden">
        <div class="mx-auto max-w-6xl">
          <div
            class="rounded-2xl border border-zinc-200 bg-white shadow-lg px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-2 w-2 rounded-full"
                :style="{ backgroundColor: calculated_route_detail?.StrokeColor || '#111827' }"></span>
              <span class="text-[13px] text-zinc-700">
                {{ calculated_route_detail?.StartLocation }} → {{ calculated_route_detail?.DestinationLocation }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="delete_calculated_route(calculated_route_detail._id)" type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-rose-600 text-rose-700 px-4 py-2 text-[13px] font-semibold hover:bg-rose-50 active:scale-[0.99]">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="successMessage" class="fixed left-1/2 -translate-x-1/2 top-16 z-[100]
          w-[calc(100%-2rem)] max-w-2xl rounded-xl border border-green-200
          bg-green-50 p-4 text-green-700 text-sm shadow-lg">
      {{ successMessage }} <span v-if="countdown">({{ countdown }})</span>
    </div>
  </section>
</template>

<script>
import GoogleMaps from '../components/GoogleMaps.vue';
import axios from 'axios';
import { UseStore } from '../stores/store';
export default {
  name: 'CalculatedRouteDetail',
  components: {
    GoogleMaps
  },
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  data: function () {
    return {
      isLoading: true,
      errorMessage: '',
      calculated_route_detail: {},
      build_route_button_triggered: 0,
      successMessage: '',
      countdown: 0,
      share_route_service_started: false,
      showExported: false,
      avaliable_currencies: [],
      selected_currency: '',
      calculate_currency_service_fx_data: {}
    };
  },
  async created() {
    this.share_route_service_started = false;
    this.store.calculated_route_detail_overview_details = [];
    this.store.calculated_route_detail_active = false;

    var { Token } = this.$route.query;

    var { _id } = this.$route.params || {};
    if (_id) await this.get_calculated_route_detail(_id, Token);

    await this.get_avaliable_currencies();
  },
  async beforeUnmount() {
    this.store.calculated_route_detail_overview_details = [];
    this.store.calculated_route_detail_active = false;
  },
  computed: {
    vehicleLabel() {
      var v = this.calculated_route_detail?.VehicleId || {};
      var base = [v.make, v.model].filter(Boolean).join(' ');
      return base || 'Vehicle';
    },
    drivePillClass() {
      var t = (this.calculated_route_detail?.DriveType || '').toLowerCase();
      if (t.includes('aggressive')) {
        return 'border-rose-600 text-rose-700';
      } else if (t.includes('eco') || t.includes('economic')) {
        return 'border-emerald-600 text-emerald-700';
      }
      return 'border-zinc-300 text-zinc-700';
    }
  },
  methods: {
    async on_currency_change(val) {
      var currency_code = val;
      this.errorMessage = '';

      try {
        var response = await axios.post('/calculate/currency', { _id: this.calculated_route_detail._id, currency_code: currency_code });
        if (response.status !== 200) return this.errorMessage = response?.data?.message || 'An error occurred while selecting the currency. Please try again later.';

        this.calculate_currency_service_fx_data = response.data.data.fx;
        Object.assign(this.calculate_currency_service_fx_data, { request_date: response.data.data.request_date_formatted });

        var calculate_currency_results = response.data.data.results;
        for (var i = 0; i < calculate_currency_results.length; i++) {
          var row_data = calculate_currency_results[i];
          var finded_polyline_data = this.calculated_route_detail.decrypted_calculated_route_polylines.find(function (item) { return item.RouteId == row_data.polyline_id });
          if (finded_polyline_data) {
            finded_polyline_data.TollRoadEstimatedPriceDollar = row_data.converted_cost.toll_road_cost.formatted_value;
            finded_polyline_data.TotalGallonCost = row_data.converted_cost.fuel_cost.formatted_value;
            finded_polyline_data.TotalCost = row_data.converted_cost.total_cost.formatted_value;
          }
        };

      } catch (err) {
        this.errorMessage = err?.response?.data?.message || 'An error occurred while selecting the currency. Please try again later.';
      }
    },
    async get_avaliable_currencies() {
      this.errorMessage = '';

      try {
        var response = await axios.get('/currencies');
        if (response.status !== 200) return this.errorMessage = res.data.message;

        this.avaliable_currencies = response?.data?.frankfurter_service_response_data?.detailed_rates;

        var default_selected_currency = this.avaliable_currencies.find(function (item) { return item.Name === 'United States' });
        if (default_selected_currency) this.selected_currency = default_selected_currency.CurrencyCode;

      } catch (err) {
        this.errorMessage = err?.response?.data?.message || "Currencies not found, please try again later.";
      }
    },
    copySharedLink() {
      var link = this.calculated_route_detail?.shared_link?.formatted_url;
      if (!link) return;

      navigator.clipboard.writeText(link)
        .then(() => {
          this.$q.notify({ type: 'positive', message: 'Link copied!' });
        })
        .catch(() => {
          console.error('Clipboard erişimi reddedildi');
        });
    },
    async redownload_exported_pdf(_id, file_name) {
      try {
        var res = await axios.get(`/download/pdf/${_id}`, {
          responseType: 'blob',
          withCredentials: true,
        });

        var cd = res.headers['content-disposition'];
        var match = cd && cd.match(/filename="?([^"]+)"?/);
        var filename = match ? decodeURIComponent(match[1]) : `${file_name}.pdf`;

        var blob = new Blob([res.data], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('PDF indirilemedi:', err);
      }
    },
    async delete_calculated_route(_id) {
      try {
        var res = await axios.delete(`/delete/calculated/route/${_id}`);

        if (res.status >= 200 && res.status < 300) {

          this.successMessage = "The route has been successfully deleted. You will be redirected to the main screen in 5 seconds.";
          this.countdown = 5;

          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { };

          var interval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
              clearInterval(interval);
              this.$router.push({ name: 'Home' });
            }
          }, 1000);

        }
        else return;
      } catch (err) {
        this.errorMessage = "An error occurred during the deletion process.";
      }
    },
    goBack() {
      this.$router.push({ name: 'Home', query: { Page: 1 } });
    },
    prettyToll(code) {
      if (!code) return '—';

      var parts = String(code).split('_');
      if (parts.length <= 1) return code;

      var country = parts[0] || '';
      var state = parts[1] || '';
      var name = parts.slice(2).join(' ').replace(/\s+/g, ' ').trim();

      return `${country} ${state} | ${name}`;
    },
    async share_route_service(share_type) {

      this.share_route_service_started = true;
      var calculated_route_id = this.calculated_route_detail._id;

      try {

        var res = await axios.post("/share/route", { RouteId: calculated_route_id, ShareType: share_type });
        this.share_route_service_started = false;

        if (!res.status === 200) return;

        if (share_type === 1) this.calculated_route_detail.exported_pdf_files = res.data.exported_pdf_files;
        if (share_type === 2) this.calculated_route_detail.shared_link = res.data.shared_link;

      } catch (err) {
        console.log(err);
      }
    },
    async get_calculated_route_detail(_id, Token) {

      this.isLoading = true;
      this.errorMessage = '';

      try {

        var res = await axios.post('/calculated/route/detail', { _id }, { headers: { "Authorization": "Bearer " + Token } });

        if (res.status !== 200) return this.errorMessage = 'Sunucudan geçerli bir yanıt gelmedi.';

        this.calculated_route_detail = res.data.decrypted_calculated_route_detail;
        this.store.Config = res.data.config;

        var StartLocation = this.calculated_route_detail.StartLocation;
        var DestinationLocation = this.calculated_route_detail.DestinationLocation;

        var start_location_details = {
          place_id: this.calculated_route_detail.StartLocationDetail.place_id,
          formatted_address: this.calculated_route_detail.StartLocationDetail.formatted_address,
          latitude: this.calculated_route_detail.StartLocationDetail.geometry.location.latitude,
          longitude: this.calculated_route_detail.StartLocationDetail.geometry.location.longitude,
          StartLocation: StartLocation
        };

        var destination_location_details = {
          place_id: this.calculated_route_detail.DestinationLocationDetail.place_id,
          formatted_address: this.calculated_route_detail.DestinationLocationDetail.formatted_address,
          latitude: this.calculated_route_detail.DestinationLocationDetail.geometry.location.latitude,
          longitude: this.calculated_route_detail.DestinationLocationDetail.geometry.location.longitude,
          DestinationLocation: DestinationLocation
        };

        var calculated_route_detail_overview_details = this.calculated_route_detail.decrypted_calculated_route_polylines.map(function (item) { return item.overview_details });

        this.store.calculated_route_detail_overview_details = calculated_route_detail_overview_details;
        this.store.calculated_route_detail_active = true;

        var THIS = this;
        setTimeout(function () {
          THIS.store.StartLocation = start_location_details;
          THIS.store.DestinationLocation = destination_location_details;
          THIS.build_route_button_triggered++;
        }, 1500);

      } catch (err) {
        this.errorMessage = err?.response?.data?.message || 'Veri çekilirken bir sorun oluştu.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
:focus-visible {
  outline: 2px solid rgba(239, 68, 68, 0.65);
  outline-offset: 2px;
}
</style>