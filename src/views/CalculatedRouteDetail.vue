<template>
  <section class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
    <!-- Üst bar -->
    <header class="sticky top-0 z-30 -mx-4 sm:mx-0 bg-white/90 backdrop-blur border-b border-zinc-100">
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
                <path fill="currentColor"
                  d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6a1 1 0 0 1 1 1v2h-2V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1ZM3 11H1v2h2v-2Zm20 0h-2v2h2v-2ZM5.64 4.22 4.22 5.64 5.64 7.06 7.06 5.64 5.64 4.22Zm13.14 13.14-1.42 1.42 1.42 1.42 1.42-1.42-1.42-1.42Zm0-11.72-1.42-1.42-1.42 1.42 1.42 1.42 1.42-1.42ZM7.06 18.36 5.64 16.94 4.22 18.36l1.42 1.42 1.42-1.42Z" />
              </svg>
              {{ createdDateLocal }}
            </span>
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
          <p class="text-[20px] font-semibold text-zinc-900">{{ calculated_route_detail?.AverageDestinationTime || '—'
          }}</p>
          <p class="text-[12px] text-zinc-500">{{ calculated_route_detail?.AverageDestinationTimeSecond }}</p>
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

      <!-- Geçiş kartı + sürüş tipi + kişi/eşya -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
        <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[14px] font-semibold text-zinc-900">Toll passes</h3>
            <span class="text-[12px] text-zinc-500">{{ (calculated_route_detail?.TollPass || []).length }} item</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tp, i) in (calculated_route_detail?.TollPass || [])" :key="i"
              class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[12px] text-zinc-700">
              <span class="h-1.5 w-1.5 rounded-full"
                :style="{ backgroundColor: i % 2 === 0 ? '#ef4444' : '#111827' }"></span>
              {{ prettyToll(tp) }}
            </span>
            <span v-if="!(calculated_route_detail?.TollPass || []).length" class="text-[13px] text-zinc-500">No
              passes</span>
          </div>
        </div>

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
              <span class="font-medium">{{ calculated_route_detail?.LuggageWeightPound ||
                (calculated_route_detail?.LuggageWeight + ' kg') }}</span>
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
            <p class="text-[18px] font-semibold text-zinc-900">$ {{ calculated_route_detail?.FuelPriceAtTransactionTime
            }} <span class="text-[12px] text-zinc-500">/ gallon</span></p>
          </div>
          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <p class="text-[12px] text-zinc-500">Fuel total</p>
            <p class="text-[18px] font-semibold text-zinc-900">$ {{ calculated_route_detail?.TotalGallonCost }}</p>
          </div>
          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <p class="text-[12px] text-zinc-500">Tolls</p>
            <p class="text-[18px] font-semibold text-zinc-900">$ {{
              calculated_route_detail?.TollRoadEstimatedPriceDollar }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
          <span class="text-[13px] text-zinc-500">Grand total</span>
          <span class="text-[20px] font-semibold text-zinc-900">$ {{ calculated_route_detail?.TotalCost }}</span>
        </div>
      </div>

      <!-- Araç bilgisi -->
      <div class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
        <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Vehicle</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <p class="text-zinc-500 text-[12px]">Make/Model</p>
            <p class="font-medium">{{ calculated_route_detail?.VehicleId?.make }} {{
              calculated_route_detail?.VehicleId?.model }}</p>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <p class="text-zinc-500 text-[12px]">Year</p>
            <p class="font-medium">{{ calculated_route_detail?.VehicleId?.year || '—' }}</p>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <p class="text-zinc-500 text-[12px]">Transmission</p>
            <p class="font-medium">{{ calculated_route_detail?.VehicleId?.trany || '—' }}</p>
          </div>
          <div class="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <p class="text-zinc-500 text-[12px]">MPG (city/comb/hwy)</p>
            <p class="font-medium">
              {{ calculated_route_detail?.VehicleId?.city08 }}/{{ calculated_route_detail?.VehicleId?.comb08 }}/{{
                calculated_route_detail?.VehicleId?.highway08 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Harita placeholder (polyline sonra) -->
      <div class="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <div class="px-4 pt-4">
          <h3 class="text-[14px] font-semibold text-zinc-900 mb-3">Route map</h3>
        </div>
        <div class="h-[360px] sm:h-[420px] w-full bg-zinc-100 relative">
          <GoogleMaps :build_route_button_triggered="this.build_route_button_triggered" />
        </div>
      </div>

      <!-- Alt yapışkan eylem çubuğu -->
      <div class="sticky bottom-3 z-30">
        <div class="mx-auto max-w-6xl">
          <div
            class="rounded-2xl border border-zinc-200 bg-white shadow-lg px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-2 w-2 rounded-full"
                :style="{ backgroundColor: calculated_route_detail?.StrokeColor || '#111827' }"></span>
              <span class="text-[13px] text-zinc-700">
                {{ calculated_route_detail?.StartLocation }} → {{ calculated_route_detail?.DestinationLocation }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-black text-white px-3 sm:px-4 py-2 text-[13px] font-semibold hover:opacity-90 active:scale-[0.99]">
                Recalculate
              </button>
              <button v-on:click="delete_calculated_route(calculated_route_detail._id)" type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-rose-600 text-rose-700 px-3 sm:px-4 py-2 text-[13px] font-semibold hover:bg-rose-50 active:scale-[0.99]">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ID çıktı (debug) -->
      <div class="text-[12px] text-zinc-400 text-center">
        {{ calculated_route_detail?._id }}
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
    const store = UseStore();
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

    const { _id } = this.$route.params || {};
    await this.get_calculated_route_detail(_id);

    this.store.calculated_route_detail_active = true;
  },
  unmounted() {
    this.store.calculated_route_detail_overview_details = {};
    this.store.calculated_route_detail_active = false;
  },
  computed: {
    vehicleLabel() {
      const v = this.calculated_route_detail?.VehicleId || {};
      const base = [v.make, v.model].filter(Boolean).join(' ');
      return base || 'Vehicle';
    },
    createdDateLocal() {
      const raw = this.calculated_route_detail?.CreatedDate;
      if (!raw) return '—';
      // Beklenen format "YYYY/MM/DD HH:mm:ss"
      try {
        // Safari güvenliği için / yerine - ile normalize edelim
        const normalized = raw.replace(/\//g, '-');
        const d = new Date(normalized);
        if (isNaN(d.getTime())) return raw;
        return d.toLocaleString();
      } catch {
        return raw;
      }
    },
    drivePillClass() {
      const t = (this.calculated_route_detail?.DriveType || '').toLowerCase();
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
      this.$router.push({ name: 'Home' });
    },
    prettyToll(code) {
      if (!code) return '—';
      // "US_WA_GOOD_TO_GO" -> "US WA | GOOD TO GO"
      const parts = String(code).split('_');
      if (parts.length <= 1) return code;
      const country = parts[0] || '';
      const state = parts[1] || '';
      const name = parts.slice(2).join(' ').replace(/\s+/g, ' ').trim();
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