<template>
    <aside class="hidden md:block w-72 shrink-0">
        <div class="sticky top-24 space-y-4">
            <div class="rounded-2xl bg-[#fcfcfc] ring-1 ring-zinc-100 shadow-sm px-4 py-4">
                <button type="button" class="w-full flex items-center justify-between gap-3 mb-1"
                    @click="accountCardOpen = !accountCardOpen">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-11 w-11 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold shadow-sm">
                            {{ (store.UserData?.UserName || 'U').charAt(0).toUpperCase() }}
                        </div>
                        <div class="min-w-0 text-left">
                            <p class="text-sm font-semibold text-zinc-900 truncate" :title="store.UserData?.UserName">
                                {{ store.UserData?.UserName || 'User' }}
                            </p>
                            <p class="text-[11px] text-zinc-500">RouteWise account</p>
                        </div>
                    </div>
                    <svg class="h-4 w-4 text-zinc-400 transition-transform duration-200"
                        :class="accountCardOpen ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none">
                        <path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <Transition enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                    <div v-show="accountCardOpen" class="pt-2">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="inline-flex h-2.5 w-2.5 rounded-full"
                                :class="store.UserData?.Active ? 'bg-emerald-500' : 'bg-zinc-400'"></span>
                            <p class="text-[11px] font-medium text-zinc-600">
                                {{ store.UserData?.Active ? 'Active session' : 'Inactive' }}
                            </p>
                        </div>
                        <dl class="space-y-2 text-[12px] text-zinc-600">
                            <div class="flex justify-between gap-3">
                                <dt class="text-zinc-400">Created</dt>
                                <dd class="font-medium text-right">
                                    {{ store.UserData?.CreatedDate || '—' }}
                                </dd>
                            </div>
                            <div class="flex justify-between gap-3">
                                <dt class="text-zinc-400">Last login</dt>
                                <dd class="font-medium text-right">
                                    {{ store.UserData?.LoginDate || '—' }}
                                </dd>
                            </div>
                            <div class="flex justify-between gap-3">
                                <dt class="text-zinc-400">Last update</dt>
                                <dd class="font-medium text-right">
                                    {{ store.UserData?.UpdatedDate || '—' }}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </Transition>
            </div>
            <div v-if="store.UserData?.session_details"
                class="rounded-2xl bg-white ring-1 ring-zinc-100 shadow-sm px-4 py-4">
                <button type="button" class="w-full flex items-center justify-between gap-3 mb-1"
                    @click="sessionCardOpen = !sessionCardOpen">
                    <p class="text-xs font-semibold text-zinc-800">Session details</p>

                    <svg class="h-4 w-4 text-zinc-400 transition-transform duration-200"
                        :class="sessionCardOpen ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none">
                        <path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <Transition enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                    <dl v-show="sessionCardOpen" class="space-y-2 text-[12px] text-zinc-600 pt-2">
                        <div class="flex justify-between gap-3">
                            <dt class="text-zinc-400">Session start</dt>
                            <dd class="font-medium text-right">
                                {{ store.UserData.session_details.session_start_date || '—' }}
                            </dd>
                        </div>
                        <div class="flex justify-between gap-3">
                            <dt class="text-zinc-400">Session end</dt>
                            <dd class="font-medium text-right">
                                {{ store.UserData.session_details.session_end_date || '—' }}
                            </dd>
                        </div>
                        <div class="flex justify-between gap-3">
                            <dt class="text-zinc-400">Login date</dt>
                            <dd class="font-medium text-right">
                                {{ store.UserData.session_details.login_date || '—' }}
                            </dd>
                        </div>
                    </dl>
                </Transition>
            </div>
            <div v-if="store.report_result" class="rounded-2xl bg-white ring-1 ring-zinc-100 shadow-sm px-4 py-4">
                <p class="text-xs font-semibold text-zinc-800 mb-3">Usage summary</p>
                <div class="space-y-4 text-[12px] text-zinc-600">
                    <div class="space-y-2">

                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <div
                                    class="h-7 w-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 20c2 0 3-1 4-3s2-3 4-3h2a3 3 0 0 0 0-6h-1" stroke="currentColor"
                                            stroke-width="1.6" />
                                        <circle cx="7" cy="6" r="2" stroke="currentColor" stroke-width="1.6" />
                                        <circle cx="17" cy="18" r="2" stroke="currentColor" stroke-width="1.6" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-medium text-zinc-800">Total routes</p>
                                    <p class="text-[11px] text-zinc-500">Calculated route count</p>
                                </div>
                            </div>
                            <p class="text-sm font-semibold text-zinc-900">
                                {{ store.report_result.total_calculated_routes }}
                            </p>
                        </div>
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <div
                                    class="h-7 w-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 17L10 7l5 5 4-8" stroke="currentColor" stroke-width="1.6" />
                                        <circle cx="5" cy="17" r="1.5" fill="currentColor" />
                                        <circle cx="10" cy="7" r="1.5" fill="currentColor" />
                                        <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                                        <circle cx="19" cy="4" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-medium text-zinc-800">Total polylines</p>
                                    <p class="text-[11px] text-zinc-500">Alternative path count</p>
                                </div>
                            </div>
                            <p class="text-sm font-semibold text-zinc-900">
                                {{ store.report_result.total_calculated_polylines }}
                            </p>
                        </div>
                    </div>
                    <hr class="border-zinc-100" />
                    <div class="space-y-1">
                        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Total distance</p>
                        <p class="text-[13px] font-semibold text-zinc-900">
                            {{ store.report_result.total_distance_km }} km
                        </p>
                        <p class="text-[11px] text-zinc-500">
                            {{ store.report_result.total_distance_mil }} mil
                        </p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Total fuel used</p>
                        <p class="text-[13px] font-semibold text-zinc-900">
                            {{ store.report_result.total_consumed_fuel_litre }} L
                        </p>
                        <p class="text-[11px] text-zinc-500">
                            {{ store.report_result.total_consumed_fuel_gallon }} gal
                        </p>
                    </div>
                    <div class="flex items-center justify-between gap-3 pt-1">
                        <div>
                            <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Avg cost per route
                            </p>
                            <p class="text-[11px] text-zinc-500">Approximate</p>
                        </div>
                        <p class="text-sm font-semibold text-zinc-900">
                            ${{ store.report_result.average_total_cost }}
                        </p>
                    </div>
                    <hr class="border-zinc-100" />
                    <div>
                        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-2">
                            Popular vehicles
                        </p>
                        <div class="space-y-2">
                            <div v-for="(v, idx) in store.report_result.popular_vehicles" :key="idx"
                                class="p-2 rounded-lg bg-zinc-50 ring-1 ring-zinc-100">
                                <p class="font-semibold text-zinc-900 text-[12px]">
                                    {{ v.Make }} {{ v.Model }}
                                </p>
                                <p class="text-[11px] text-zinc-500">
                                    {{ v.Drive }} · {{ v.Fuel }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-2">
                            Popular fuel types
                        </p>
                        <div class="space-y-2">
                            <div v-for="(f, idx) in store.report_result.popular_fuel_types" :key="idx"
                                class="flex items-center justify-between p-2 rounded-lg bg-zinc-50 ring-1 ring-zinc-100">
                                <p class="text-[12px] font-medium text-zinc-800">
                                    {{ f.fuel_type }}
                                </p>
                                <p class="text-[12px] font-semibold text-zinc-900">
                                    {{ f.count }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr class="border-zinc-100" />
                    <div class="space-y-1">
                        <p class="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-1">
                            Activity range
                        </p>
                        <p class="text-[11px] text-zinc-900 font-medium">
                            {{ store.report_result.first_created_calculated_route_date }}
                        </p>
                        <p class="text-[11px] text-zinc-500">
                            → {{ store.report_result.last_created_calculated_route_date }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup() {
        var store = UseStore();
        return {
            store
        }
    },
    data:function(){
        return{
            accountCardOpen: false,
            sessionCardOpen : false
        }
    }
}
</script>