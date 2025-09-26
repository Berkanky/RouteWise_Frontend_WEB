<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-zinc-100">
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

      <div class="flex items-center gap-2">
        <span v-if="calculated_route_detail?.IsRouteCompleted === true"
          class="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
          <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span> Completed
        </span>
        <span v-else
          class="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[12px] font-medium text-rose-700">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-600"></span> In progress
        </span>
      </div>
    </div>
  </header>
  <section
    class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6 pb-[calc(96px+max(env(safe-area-inset-bottom),0px))] sm:pb-8">

    <!-- Yükleniyor -->
    <div v-if="isLoading" class="py-10 grid gap-4">
      <div class="h-20 rounded-xl bg-zinc-100 animate-pulse"></div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
        <div class="h-32 rounded-xl bg-zinc-100 animate-pulse"></div>
      </div>
      <div class="h-80 rounded-xl bg-zinc-100 animate-pulse"></div>
    </div>

    <!-- Hata -->
    <div v-else-if="errorMessage" class="mt-6">
      <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        {{ errorMessage }}
      </div>
    </div>

    <!-- İçerik -->
    <div v-else class="space-y-6 sm:space-y-8">
      <!-- Özet üst: isim/araç ve meta -->
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm p-4 sm:p-5">
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
            <div class="flex flex-wrap items-center gap-2 mt-1 text-[12px]">
              <!-- Requested -->
              <span class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50
               px-2.5 py-1.5 text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor"
                    d="M12 8a1 1 0 0 1 1 1v3.59l2.3 2.3-1.42 1.42L11 13.41V9a1 1 0 0 1 1-1Zm0-6a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                </svg>
                <span class="text-zinc-600">Requested:</span>
                <span class="font-medium text-zinc-700">
                  {{ this.calculated_route_detail?.request_date }}
                </span>
              </span>

              <!-- Created -->
              <span class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50
               px-2.5 py-1.5 text-zinc-700">
                <svg viewBox="0 0 24 24" class="h-4 w-4">
                  <path fill="currentColor" d="M19 3H5v18l7-3 7 3V3Z" />
                </svg>
                <span class="text-zinc-600">Created:</span>
                <span class="font-medium text-zinc-700">
                  {{ this.calculated_route_detail?.CreatedDate }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI kartları -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p class="text-[12px] text-zinc-500">Distance</p>
          <p class="text-[20px] font-semibold text-zinc-900">{{ calculated_route_detail?.DistanceKM }} <span
              class="text-[12px] text-zinc-500">km</span></p>
          <p class="text-[12px] text-zinc-500">{{ calculated_route_detail?.DistanceMIL }} mi</p>
        </div>
        <div class="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p class="text-[12px] text-zinc-500">ETA</p>
          <p class="text-[20px] font-semibold text-zinc-900">{{ calculated_route_detail?.AverageDestinationTimeFormatted
            || '—'
          }}</p>
        </div>
        <div class="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p class="text-[12px] text-zinc-500">Fuel</p>
          <p class="text-[20px] font-semibold text-zinc-900">{{ calculated_route_detail?.TotalGallon }} <span
              class="text-[12px] text-zinc-500">gal</span></p>
          <p class="text-[12px] text-zinc-500">@ ${{ calculated_route_detail?.FuelPriceAtTransactionTime }} / gal</p>
        </div>
        <div class="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p class="text-[12px] text-zinc-500">Total cost</p>
          <p class="text-[20px] font-semibold text-zinc-900">$ {{ calculated_route_detail?.TotalCost }}</p>
          <p class="text-[12px] text-zinc-500">Tolls ${{ calculated_route_detail?.TollRoadEstimatedPriceDollar }}</p>
        </div>
      </div>

      <!-- Başlangıç / Varış -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Start</h3>
          <div class="text-[13px] text-zinc-700">
            <p class="font-medium">{{ calculated_route_detail?.StartLocation || '—' }}</p>
            <div class="mt-2 grid grid-cols-3 gap-2 text-[12px] text-zinc-500">
              <div><span class="text-zinc-400">Locality</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.locality || '—' }}
                </div>
              </div>
              <div><span class="text-zinc-400">State</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.state || '—' }}</div>
              </div>
              <div><span class="text-zinc-400">Country</span>
                <div>{{ calculated_route_detail?.StartLocationDetail?.address_components_details?.country || '—' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Destination</h3>
          <div class="text-[13px] text-zinc-700">
            <p class="font-medium">{{ calculated_route_detail?.DestinationLocation || '—' }}</p>
            <div class="mt-2 grid grid-cols-3 gap-2 text-[12px] text-zinc-500">
              <div><span class="text-zinc-400">Locality</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.locality || '—'
                }}</div>
              </div>
              <div><span class="text-zinc-400">State</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.state || '—' }}
                </div>
              </div>
              <div><span class="text-zinc-400">Country</span>
                <div>{{ calculated_route_detail?.DestinationLocationDetail?.address_components_details?.country || '—'
                }}</div>
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
        <!-- Toll passes -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[14px] font-semibold text-zinc-900">Toll passes</h3>
            <span class="text-[12px] text-zinc-500">
              {{ (calculated_route_detail?.TollPass || []).length }} item
            </span>
          </div>

          <!-- Mobil: 2 kolon. >=sm: auto-fit grid; tüm chip'ler aynı genişlikte kutulara oturur -->
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

        <!-- Trip options -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
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
                <template v-if="calculated_route_detail?.LuggageWeightPound">
                  {{ calculated_route_detail.LuggageWeightPound }} <span class="text-zinc-500">lb</span>
                </template>
                <template v-else>
                  {{ calculated_route_detail?.LuggageWeight ?? '—' }} <span class="text-zinc-500">KG</span>
                </template>
              </span>
            </li>
          </ul>
        </div>
      </div>


      <!-- Maliyet kırılımı -->
      <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
        <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Cost breakdown</h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <p class="text-[12px] text-zinc-500">Fuel price</p>
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-[18px] font-semibold text-zinc-900">
                $ {{ calculated_route_detail?.FuelPriceAtTransactionTime }}
              </p>
              <span class="text-[11px] text-zinc-500 whitespace-nowrap">
                {{ calculated_route_detail?.FuelPriceUnits }}
              </span>
            </div>
          </div>

          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <p class="text-[12px] text-zinc-500">Fuel total</p>
            <p class="text-[18px] font-semibold text-zinc-900">
              $ {{ calculated_route_detail?.TotalGallonCost }}
            </p>
          </div>

          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <p class="text-[12px] text-zinc-500">Tolls</p>
            <p class="text-[18px] font-semibold text-zinc-900">
              $ {{ calculated_route_detail?.TollRoadEstimatedPriceDollar }}
            </p>

            <!-- Source -->
            <span v-if="calculated_route_detail?.google_service_source"
                  class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] text-sky-800">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
                <path fill="currentColor" d="M3 6h18v2H3v8h18V6H3Zm0 12h18v2H3v-2Z"/>
              </svg>
              <span class="font-semibold">Source:</span>
              <span class="font-medium text-sky-900 truncate max-w-[140px] sm:max-w-none">
                {{ calculated_route_detail?.google_service_source }}
              </span>
            </span>
          </div>
        </div>

        <!-- Period + Source daha belirgin -->
        <div class="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
          <!-- Units (aynı kalsın) -->
          <span
            class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
              <path fill="currentColor" d="M7 3h10v2H7v14h10v2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
            </svg>
            <span class="font-medium">
              {{ calculated_route_detail?.FuelPriceUnits }}
            </span>
          </span>

          <!-- Price period (vurgulu) -->
          <span
            class="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-800">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
              <path fill="currentColor" d="M7 3v2H5v14a2 2 0 0 0 2 2h10V5h-2V3h-2v2H9V3H7Zm2 8h6v2H9v-2Z" />
            </svg>
            <span class="font-semibold">Price period:</span>
            <span class="font-medium text-amber-900">
              {{ this.store.FormatFuelPeriod?.(calculated_route_detail?.FuelPricePeriod) ||
                calculated_route_detail?.FuelPricePeriod }}
            </span>
          </span>

          <!-- Source (vurgulu) -->
          <span
            class="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-800">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
              <path fill="currentColor" d="M3 6h18v2H3v8h18V6H3Zm0 12h18v2H3v-2Z" />
            </svg>
            <span class="font-semibold">Source:</span>
            <span class="font-medium text-sky-900 truncate max-w-[140px] sm:max-w-none">
              {{ calculated_route_detail?.fuel_details_source }}
            </span>
          </span>

          <!-- FuelTypeDetail (aynı kalsın) -->
          <span
            class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-600">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
              <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
            </svg>
            <span class="font-medium text-zinc-700">
              {{ calculated_route_detail?.FuelTypeDetail }}
            </span>
          </span>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
          <span class="text-[13px] text-zinc-500">Grand total</span>
          <span class="text-[20px] font-semibold text-zinc-900">
            $ {{ calculated_route_detail?.TotalCost }}
          </span>
        </div>
      </div>


      <!-- Araç bilgisi -->
      <div class="rounded-2xl border border-zinc-100 bg-white p-4 sm:p-5 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-semibold text-zinc-900">Vehicle</h3>

          <!-- Öne çıkan rozetler -->
          <div class="hidden sm:flex items-center gap-2">
            <span v-if="calculated_route_detail?.VehicleId?.drive"
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.drive }}
            </span>
            <span v-if="calculated_route_detail?.VehicleId?.trany"
              class="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
              {{ calculated_route_detail?.VehicleId?.trany }}
            </span>
            <span v-if="calculated_route_detail?.VehicleId?.fueltype"
              class="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[12px] text-rose-700">
              {{ calculated_route_detail?.VehicleId?.fueltype }}
            </span>

            <!-- Vehicle dataset source (yeni) -->
            <span v-if="calculated_route_detail?.vehicle_dataset_source"
              class="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-800">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
                <path fill="currentColor" d="M3 6h18v2H3v8h18V6H3Zm0 12h18v2H3v-2Z" />
              </svg>
              <span class="font-semibold">Source:</span>
              <span class="font-medium text-sky-900 truncate max-w-[160px] sm:max-w-none">
                {{ calculated_route_detail?.vehicle_dataset_source }}
              </span>
            </span>
          </div>
        </div>

        <!-- Sadece util class: dl/dt/dd + grid -->
        <dl class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Make</dt>
            <dd class="text-[13px] font-medium text-zinc-900">{{ calculated_route_detail?.VehicleId?.make || '—' }}</dd>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <dt class="text-zinc-500 text-[12px] leading-none mb-1">Model</dt>
            <dd class="text-[13px] font-medium text-zinc-900 truncate">{{ calculated_route_detail?.VehicleId?.model ||
              '—' }}</dd>
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

          <!-- MPG üçlü tek hücrede -->
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


      <!-- Harita placeholder (polyline sonra) -->
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <div class="px-4 pt-4">
        </div>
        <div class="h-[360px] sm:h-[420px] w-full bg-zinc-100 relative">
          <GoogleMaps :build_route_button_triggered="this.build_route_button_triggered" />
        </div>
      </div>

      <!-- Alt yapışkan eylem çubuğu -->
      <div class="sm:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
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
              <button type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-black text-white px-3 py-2 text-[13px] font-semibold hover:opacity-90 active:scale-[0.99]">
                Recalculate
              </button>
              <button @click="delete_calculated_route(calculated_route_detail._id)" type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-rose-600 text-rose-700 px-3 py-2 text-[13px] font-semibold hover:bg-rose-50 active:scale-[0.99]">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop sticky -->
      <div class="hidden sm:block sticky bottom-3 z-30">
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

      <!-- ID çıktı (debug) -->
      <div class="text-[12px] text-zinc-400 text-center">
        {{ this.store.AppVersion }} - {{ calculated_route_detail?._id }}
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
  props: {
    data: { type: Object, required: false, default: null } // harici prop da kabul
  },
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
      countdown: 0
    };
  },
  async mounted() {
    this.store.calculated_route_detail_overview_details = {};

    var { _id } = this.$route.params || {};
    await this.get_calculated_route_detail(_id);

    this.store.calculated_route_detail_active = true;
  },
  unmounted() {
    this.store.calculated_route_detail_overview_details = {};
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
    async delete_calculated_route(_id) {
      try {
        var res = await axios.delete(`/delete/calculated/route/${_id}`);
        if (res.status >= 200 && res.status < 300) {
          // Başarıyla silindi
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
      } catch (err) {
        this.errorMessage = "An error occurred during the deletion process.";
      }
    },
    goBack() {
      var Page = 1;
      this.$router.push({ name: 'Home', query: { Page: Page } });
    },
    prettyToll(code) {
      if (!code) return '—';
      // "US_WA_GOOD_TO_GO" -> "US WA | GOOD TO GO"
      var parts = String(code).split('_');
      if (parts.length <= 1) return code;
      var country = parts[0] || '';
      var state = parts[1] || '';
      var name = parts.slice(2).join(' ').replace(/\s+/g, ' ').trim();
      return `${country} ${state} | ${name}`;
    },
    async get_calculated_route_detail(_id) {
      this.isLoading = true;
      this.errorMessage = '';
      let res = null;
      try {
        res = await axios.post('/calculated/route/detail', { _id });
        if (res?.status === 200 && res?.data?.decrypted_calculated_route_detail) {
          this.calculated_route_detail = res.data.decrypted_calculated_route_detail;

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

          var calculated_route_detail_overview_details = this.calculated_route_detail.overview_details;
          this.store.calculated_route_detail_overview_details = calculated_route_detail_overview_details;

          this.store.calculated_route_detail_active = true;

          var THIS = this;
          setTimeout(function () {
            THIS.store.StartLocation = start_location_details;
            THIS.store.DestinationLocation = destination_location_details;
            THIS.build_route_button_triggered++;
          }, 1500);

        } else {
          this.errorMessage = 'Sunucudan geçerli bir yanıt gelmedi.';
        }
      } catch (err) {
        // Kodu orada burada boğduysan en azından söyle bari
        this.errorMessage = err?.response?.data?.message || 'Veri çekilirken bir sorun oluştu.';
      } finally {
        // Konsolda gör, ama uygulamayı patlatma
        try { console.debug('route/detail response:', res); } catch { }
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Native hissi için küçük dokunuşlar */
:focus-visible {
  outline: 2px solid rgba(239, 68, 68, 0.65);
  outline-offset: 2px;
}
</style>