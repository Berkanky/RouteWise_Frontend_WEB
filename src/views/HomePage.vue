<template>
  <div class="min-h-screen bg-white px-3 py-6 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(route, idx) in routes" :key="route._id || idx" class="h-full flex flex-col bg-[#fcfcfc] ring-1 ring-zinc-100 rounded-xl shadow-sm
                 hover:shadow-md hover:-translate-y-0.5 transition-transform duration-150 ease-out px-4 py-5">
          <div class="flex-1">
            <div class="text-right">
              <div class="inline-flex items-center gap-2">
                <span class="text-[10px] uppercase bg-black text-white px-2 py-1 tracking-wide rounded">
                  {{ route.TravelMode || '—' }}
                </span>
                <span class="text-[11px] text-zinc-500">
                  {{ route.decrypted_calculated_route_polylines?.length || 0 }} Alternative
                </span>
              </div>
            </div>

            <div
              class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] sm:text-[14px] text-zinc-800 items-stretch">
              <div class="rounded-lg bg-zinc-50 p-3 h-full">
                <p class="text-zinc-400 text-[12px]">Best ETA</p>
                <p class="font-medium leading-snug">{{ route.best_eta }}</p>
              </div>
              <div class="rounded-lg bg-zinc-50 p-3 h-full">
                <p class="text-zinc-400 text-[12px]">Best Cost</p>
                <p class="font-medium">${{ route.best_total_cost }}</p>
              </div>
              <div class="rounded-lg bg-zinc-50 p-3 h-full">
                <p class="text-zinc-400 text-[12px]">Best Distance</p>
                <p class="font-medium">{{ route.best_distance_mil }} mil</p>
              </div>
            </div>

            <div class="mt-4 pb-2 mb-2 border-b border-zinc-100">
              <p class="text-[12px] text-zinc-400 mb-1.5">Alternative Routes</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(alt, i) in route.decrypted_calculated_route_polylines" :key="alt._id || i" class="inline-flex items-center text-[11px] px-2 py-1 rounded-full
                         bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition">
                  {{ alt.AverageDestinationTimeFormatted }} | {{ alt.DistanceMIL }} mil | ${{ alt.TotalCost }}
                </span>
              </div>
              <span v-if="route.more_count > 0"
                class="mt-2 inline-block text-[11px] px-2 py-1 rounded-full border border-dashed text-zinc-500">
                +{{ route.more_count }} more
              </span>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3 text-[13px] text-zinc-700">
              <div>
                <p class="text-zinc-400 text-[12px]">Car</p>
                <p>{{ route.VehicleId?.make || '—' }} {{ route.VehicleId?.model || '' }}</p>
              </div>
              <div>
                <p class="text-zinc-400 text-[12px]">Engine</p>
                <p>{{ route.VehicleId?.displ || '—' }}L • {{ route.VehicleId?.fueltype1 || '—' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
            <p class="text-[11px] text-zinc-400 leading-tight">
              Total cost range: ${{ route.min_total_cost }}–{{ route.max_total_cost }}
            </p>

            <button type="button" @click="handleViewDetail(route._id)" aria-label="View detail for {{ route.Name }}"
              class="w-full sm:w-auto h-10 px-4 rounded-lg
                     border border-zinc-300 text-zinc-800 font-semibold text-[13px] tracking-wide
                     bg-white hover:border-zinc-400 hover:bg-zinc-50
                     active:scale-[0.98] active:bg-zinc-100
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/30
                     shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-150 ease-in-out">
              View Detail
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 z-30">
      <div class="bg-white/90 backdrop-blur border-t border-zinc-200/80">
        <div class="h-14 sm:h-[60px] px-3 sm:px-4 flex items-center justify-between gap-4
                 md:mx-auto md:max-w-3xl md:justify-center" style="padding-bottom: env(safe-area-inset-bottom);">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative h-1.5 w-28 rounded bg-zinc-200/90 overflow-hidden">
              <div class="absolute inset-y-0 left-0 bg-zinc-900 transition-all duration-300"
                :style="{ width: progressPct + '%' }"></div>
            </div>
            <p v-if="TotalCount !== null" class="text-[12px] text-zinc-600 truncate">
              {{ routes.length }} / {{ TotalCount }} Displaying
            </p>
          </div>

          <button v-if="hasMore" :disabled="loading" @click="manualLoadMore" class="inline-flex h-10 sm:h-11 px-4 items-center justify-center gap-2
                   rounded-md bg-white text-zinc-900 border border-zinc-200
                   hover:bg-zinc-50 active:bg-zinc-100 active:translate-y-px
                   disabled:opacity-60 disabled:active:translate-y-0 disabled:pointer-events-none
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20
                   transition touch-manipulation md:ml-4 md:shrink-0">
            <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" class="opacity-25" />
              <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
            </svg>
            <span class="text-[13px] font-medium">
              {{ loading ? 'Loading' : 'More' }}
            </span>
          </button>
        </div>
      </div>
      <div id="sentinel" class="h-1 w-full"></div>
    </div>
  </div>
</template>

<script>
import { UseStore } from '../stores/store';
import axios from 'axios';
export default {
  name: "App",
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  data() {
    return {
      routes: [],
      Page: 1,
      PageSize: 12,
      TotalCount: null,
      loading: false,
      _io: null,
      _ioTick: 0,
      _abortCtrl: null
    }
  },
  computed: {
    hasMore() {
      if (this.TotalCount === null) return true;
      return this.Page * this.PageSize < this.TotalCount;
    },
    progressPct() {
      if (!this.TotalCount || this.TotalCount <= 0) return 0;
      var pct = (this.routes.length / this.TotalCount) * 100;
      return Math.max(0, Math.min(100, Math.round(pct)));
    }
  },
  async created() {

    var { Page } = this.$route.query;
    if (Page) this.Page = Page;

    await this.calculated_routes_service({ reset: true });

    this.setupInfiniteScroll();
    document.addEventListener('visibilitychange', this._onVisChange);
  },
  beforeUnmount() {
    this._io?.disconnect?.();
    document.removeEventListener('visibilitychange', this._onVisChange);
    this._abortCtrl?.abort?.();
  },
  methods: {
    handleViewDetail(_id) {
      this.$router.push({ name: 'CalculatedRouteDetail', params: { _id: _id } });
    },
    _onVisChange() {
      if (document.visibilityState !== 'visible') {
        this._io?.disconnect?.();
      } else {
        this.$nextTick(() => this.setupInfiniteScroll());
      }
    },
    setupInfiniteScroll() {
      var el = document.getElementById('sentinel');
      if (!el) return;

      this._io?.disconnect?.();
      this._io = new IntersectionObserver((entries) => {

        var now = performance.now();
        if (now - this._ioTick < 400) return;

        var visible = entries.some(e => e.isIntersecting);
        if (!visible) return;
        if (!this.hasMore || this.loading) return;

        this._ioTick = now;
        this.nextPage();
      }, {
        root: null,
        rootMargin: '300px',
        threshold: 0
      });

      this._io.observe(el);
    },

    nextPage() {
      var next = (Number(this.$route.query.Page ?? this.Page) || 1) + 1;
      this.$router.replace({ name: 'Home', query: { ...this.$route.query, Page: next } });
    },
    manualLoadMore() {
      if (!this.hasMore || this.loading) return;
      this.nextPage();
    },
    async calculated_routes_service({ reset = false } = {}) {
      if (this.loading) return;
      this.loading = true;

      try { this._abortCtrl?.abort?.(); } catch { }
      this._abortCtrl = new AbortController();

      try {
        var res = await axios.get(`/calculated/routes`, {
          params: { Page: this.Page },
          signal: this._abortCtrl.signal
        });

        if (res.status !== 200) return;

        if (typeof res.data.PageSize === 'number') this.PageSize = res.data.PageSize;
        if (typeof res.data.TotalCount === 'number') this.TotalCount = res.data.TotalCount;

        var list = Array.isArray(res.data.Routes) ? res.data.Routes : [];

        if (reset || this.Page === 1) this.routes = list;
        else this.routes = [...this.routes, ...list];

        this.loading = false;
      } catch (err) {

        console.log(err);
      }
    }
  },
  watch: {
    '$route.query.Page': {
      async handler() {

        var nextPage = Number(this.$route.query.Page ?? 1);
        if (nextPage === this.Page) return;

        this.Page = nextPage;
        await this.calculated_routes_service({ reset: nextPage === 1 });
      },
      immediate: true
    }
  },
};
</script>
