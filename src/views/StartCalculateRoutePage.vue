<template>
  <section class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
      <aside class="lg:sticky lg:top-6">
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4">
          <h2 class="text-sm font-semibold text-zinc-800 mb-3">Route setup</h2>
          <div class="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div class="h-full bg-rose-500 transition-all" :style="{ width: progressPct + '%' }"></div>
          </div>
          <ol class="mt-4 space-y-2 text-sm">
            <li v-for="(s, i) in steps" :key="s.key" class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs"
                :class="i === step ? 'border-rose-500 text-rose-600' : (i < step ? 'border-emerald-500 text-emerald-600' : 'border-zinc-300 text-zinc-400')">
                {{ i + 1 }}
              </span>
              <button type="button" class="text-left hover:underline"
                :class="i <= step ? 'text-zinc-900' : 'text-zinc-500'" @click="goToStep(i)">
                {{ s.title }}
              </button>
            </li>
          </ol>
        </div>
      </aside>

      <main>
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-5 md:px-6 py-4 border-b border-zinc-100">
            <div>
              <div class="text-[11px] uppercase tracking-wider text-zinc-500">{{ current.title }}</div>
              <h1 class="text-xl font-semibold text-zinc-900">{{ current.subtitle }}</h1>
            </div>
            <button type="button"
              class="hidden sm:inline-flex rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
              @click="resetAll">
              Reset
            </button>
          </div>

          <div class="px-5 md:px-6 py-5">
            <template v-if="step === 0">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <!-- START -->
                <div class="relative">
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Starting Point</label>
                  <input v-model.trim="form.StartLocation" @input="FindLocation($event, 'StartLocation')"
                    @keydown.down.prevent="moveHighlight('start', 1)" @keydown.up.prevent="moveHighlight('start', -1)"
                    @keydown.enter.prevent="confirmHighlight('start')" @focus="focusedInput = 'start'" type="text"
                    inputmode="text" placeholder="e.g. Kadıköy, İstanbul"
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />

                  <!-- DROPDOWN -->
                  <ul v-if="focusedInput === 'start' && this.Suggestions.length"
                    class="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                    <li v-for="(item, i) in this.Suggestions" :key="i"
                      @mousedown.prevent="SelectLocation(item.placePrediction.placeId, item.placePrediction.text.text, 'StartLocation')"
                      class="px-3 py-2 cursor-pointer"
                      :class="item.placePrediction.placeId === this.SelectedStartLocationSuggestionPlaceId ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
                      <div class="text-sm text-zinc-800">{{ item.placePrediction.text.text || '-' }}</div>
                    </li>
                  </ul>
                </div>

                <!-- DESTINATION -->
                <div class="relative">
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Destination Point</label>
                  <input v-model.trim="form.DestinationLocation" @input="FindLocation($event, 'DestinationLocation')"
                    @keydown.down.prevent="moveHighlight('dest', 1)" @keydown.up.prevent="moveHighlight('dest', -1)"
                    @keydown.enter.prevent="confirmHighlight('dest')" @focus="focusedInput = 'dest'" type="text"
                    inputmode="text" placeholder="e.g. İzmit, Kocaeli"
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />

                  <!-- DROPDOWN -->
                  <ul v-if="focusedInput === 'dest' && this.Suggestions.length"
                    class="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                    <li v-for="(item, i) in this.Suggestions" :key="i"
                      @mousedown.prevent="SelectLocation(item.placePrediction.placeId, item.placePrediction.text.text, 'DestinationLocation')"
                      class="px-3 py-2 cursor-pointer"
                      :class="item.placePrediction.placeId === this.SelectedDestinationLocationSuggestionPlaceId ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
                      <div class="text-sm text-zinc-800">{{ item.placePrediction.text.text || '-' }}</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-4">
                <button type="button"
                  class="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  @click="previewOnMap">
                  Show on the map
                </button>
              </div>
            </template>

            <template v-else-if="step === 1">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Car Brand</label>
                  <HeadlessSelect v-model="form.CarBrand" :items="carBrandItems" placeholder="Select car brand" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Car Model</label>
                  <HeadlessSelect v-model="form.CarModel" :items="carModelItems" placeholder="Select car model" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Engine Type</label>
                  <HeadlessSelect v-model="form.Engine" :items="engineItems" placeholder="Select engine type" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Fuel Type</label>
                  <HeadlessSelect v-model="form.FuelType" :items="fuelItems" placeholder="Select fuel type" />
                </div>
              </div>
            </template>

            <template v-else-if="step === 2">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Route Type</label>
                  <HeadlessSelect v-model="form.RouteType" :items="routeTypeItems" placeholder="Select route type" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Driving Style</label>
                  <HeadlessSelect v-model="form.DriveType" :items="driveTypeItems" placeholder="Select driving style" />
                </div>
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Toll Pass</label>
                  <HeadlessMultiSelect v-model="form.TollPass" :items="tollPassItems"
                    placeholder="Select toll passes" />
                  <p class="mt-1 text-xs text-zinc-500">Model: <code>form.TollPass: string[]</code></p>
                </div>
              </div>
            </template>

            <template v-else-if="step === 3">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Luggage Weight (kg)</label>
                  <input v-model.number="form.Luggage" type="number" min="0" inputmode="numeric" placeholder="e.g. 20"
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Number of People</label>
                  <input v-model.number="form.Person" type="number" min="1" inputmode="numeric" placeholder="e.g. 2"
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="grid grid-cols-1 gap-5">
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Route Name</label>
                  <input v-model.trim="form.Name" type="text" placeholder="Enter a name for this route"
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-800 mb-1">Description</label>
                  <textarea v-model.trim="form.Description" rows="4" placeholder="Short description..."
                    class="w-full rounded-lg border border-zinc-300 bg-white placeholder:text-zinc-400 px-3 py-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-300"></textarea>
                </div>
              </div>
            </template>
          </div>

          <div class="hidden sm:flex items-center justify-between px-5 md:px-6 py-4 border-t border-zinc-100">
            <button type="button"
              class="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              :disabled="step === 0" @click="prevStep">Previous</button>
            <div class="flex items-center gap-2">
              <button v-if="step < steps.length - 1" type="button"
                class="rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                :disabled="!canGoNext" @click="nextStep">Next</button>
              <button v-else type="button"
                class="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                :disabled="!canSubmit" @click="submitWizard">Save & Calculate</button>
            </div>
          </div>
        </div>

        <div class="sm:hidden fixed inset-x-0 bottom-0 bg-white/90 backdrop-blur border-t border-zinc-200 p-3">
          <div class="mx-auto max-w-6xl flex items-center justify-between">
            <button type="button" class="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700"
              :disabled="step === 0" @click="prevStep">Prev</button>
            <button v-if="step < steps.length - 1" type="button"
              class="rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              :disabled="!canGoNext" @click="nextStep">Next</button>
            <button v-else type="button"
              class="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              :disabled="!canSubmit" @click="submitWizard">Save & Calculate</button>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
import { h } from "vue"
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, TransitionRoot } from "@headlessui/vue"
import axios from "axios"
import { UseStore } from "../stores/store";

const HeadlessSelect = {
  name: "HeadlessSelect",
  components: { Listbox, ListboxButton, ListboxOptions, ListboxOption, TransitionRoot },
  props: {
    modelValue: { default: null },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: "Select" },
    disabled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false }
  },
  methods: {
    labelOf(it) {
      if (it == null) return ""
      if (typeof it === "string" || typeof it === "number") return String(it)
      return it.label ?? it.name ?? it.title ?? it.value ?? JSON.stringify(it)
    }
  },
  render() {
    return h(Listbox, {
      modelValue: this.modelValue,
      disabled: this.disabled,
      "onUpdate:modelValue": v => this.$emit("update:modelValue", v)
    }, {
      default: () => h("div", { class: "relative" }, [
        h(ListboxButton, {
          class: [
            "w-full rounded-lg border bg-white px-3 py-3 text-left text-sm",
            this.invalid ? "border-red-400 bg-red-50" : "border-zinc-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-300",
            this.disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          ]
        }, [
          (this.modelValue !== null && this.modelValue !== "")
            ? h("span", { class: "block truncate text-zinc-900" }, this.labelOf(this.modelValue))
            : h("span", { class: "block truncate text-zinc-400" }, this.placeholder),
          h("span", { class: "pointer-events-none absolute inset-y-0 right-3 flex items-center" }, [
            h("svg", { class: "h-4 w-4 text-zinc-500", viewBox: "0 0 20 20", fill: "currentColor" }, [
              h("path", { "fill-rule": "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z", "clip-rule": "evenodd" })
            ])
          ])
        ]),
        h(TransitionRoot, { leave: "transition ease-in duration-100", "leave-from": "opacity-100", "leave-to": "opacity-0" }, {
          default: () => h(ListboxOptions, { class: "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white py-1 text-sm shadow-lg focus:outline-none" },
            this.items.map((it, idx) =>
              h(ListboxOption, { key: idx, value: it }, {
                default: ({ active, selected }) =>
                  h("li", {
                    class: ["px-3 py-2 cursor-pointer", active ? "bg-zinc-50" : "", selected ? "font-medium text-zinc-900" : "text-zinc-700"]
                  }, this.labelOf(it))
              })
            )
          )
        })
      ])
    })
  }
}

const HeadlessMultiSelect = {
  name: "HeadlessMultiSelect",
  components: { Listbox, ListboxButton, ListboxOptions, ListboxOption, TransitionRoot },
  props: {
    modelValue: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: "Select options" },
    disabled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false }
  },
  methods: {
    labelOf(it) {
      if (it == null) return ""
      if (typeof it === "string" || typeof it === "number") return String(it)
      return it.label ?? it.name ?? it.title ?? it.value ?? JSON.stringify(it)
    }
  },
  render() {
    return h(Listbox, {
      multiple: true,
      modelValue: this.modelValue,
      disabled: this.disabled,
      "onUpdate:modelValue": v => this.$emit("update:modelValue", v)
    }, {
      default: () => h("div", { class: "relative" }, [
        h(ListboxButton, {
          class: [
            "w-full rounded-lg border bg-white px-3 py-3 text-left text-sm",
            this.invalid ? "border-red-400 bg-red-50" : "border-zinc-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-300",
            this.disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          ]
        }, [
          this.modelValue && this.modelValue.length
            ? h("div", { class: "flex flex-wrap gap-1" },
              this.modelValue.map((v, i) =>
                h("span", { key: i, class: "inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[12px] text-zinc-700" }, this.labelOf(v))
              )
            )
            : h("span", { class: "text-zinc-400" }, this.placeholder),
          h("span", { class: "pointer-events-none absolute inset-y-0 right-3 flex items-center" }, [
            h("svg", { class: "h-4 w-4 text-zinc-500", viewBox: "0 0 20 20", fill: "currentColor" }, [
              h("path", { "fill-rule": "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z", "clip-rule": "evenodd" })
            ])
          ])
        ]),
        h(TransitionRoot, { leave: "transition ease-in duration-100", "leave-from": "opacity-100", "leave-to": "opacity-0" }, {
          default: () => h(ListboxOptions, { class: "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white py-1 text-sm shadow-lg focus:outline-none" },
            this.items.map((it, idx) =>
              h(ListboxOption, { key: idx, value: it }, {
                default: ({ active, selected }) =>
                  h("li", {
                    class: ["px-3 py-2 cursor-pointer", active ? "bg-zinc-50" : "", selected ? "font-medium text-zinc-900" : "text-zinc-700"]
                  }, this.labelOf(it))
              })
            )
          )
        })
      ])
    })
  }
}

export default {
  name: "RouteWizard",
  components: { Listbox, ListboxButton, ListboxOptions, ListboxOption, TransitionRoot, HeadlessSelect, HeadlessMultiSelect },
  setup() {
    const store = UseStore();
    return {
      store
    }
  },
  data() {
    return {
      step: 0,
      steps: [
        { key: "locations", title: "Route Information", subtitle: "Set starting and destination points" },
        { key: "vehicle", title: "Vehicle Information", subtitle: "Car brand, model, engine and fuel" },
        { key: "journey", title: "Journey Details", subtitle: "Route type, driving style and toll passes" },
        { key: "people", title: "Passenger & Luggage", subtitle: "How many people and luggage weight" },
        { key: "meta", title: "Name & Description", subtitle: "Give the route a name and notes" }
      ],
      form: {
        StartLocation: null,
        DestinationLocation: null,
        CarBrand: null,
        CarModel: null,
        Engine: null,
        FuelType: null,
        RouteType: null,
        DriveType: null,
        TollPass: [],
        Luggage: null,
        Person: 1,
        Name: "",
        Description: ""
      },
      startLocationItems: [],
      destinationItems: [],
      carBrandItems: [],
      carModelItems: [],
      engineItems: [],
      fuelItems: [],
      routeTypeItems: [],
      driveTypeItems: [],
      tollPassItems: [],
      submitting: false,
      SuggestionType: null,
      Suggestions: [],
      focusedInput: null,
      SelectedStartLocationSuggestionPlaceId: null,
      SelectedDestinationLocationSuggestionPlaceId: null
    }
  },
  computed: {
    current() { return this.steps[this.step] },
    progressPct() { return Math.round(((this.step + 1) / this.steps.length) * 100) },
    step1Ok() { return !!this.form.StartLocation && !!this.form.DestinationLocation },
    step2Ok() { return !!this.form.CarBrand && !!this.form.CarModel && !!this.form.Engine && !!this.form.FuelType },
    step3Ok() { return !!this.form.RouteType && !!this.form.DriveType },
    step4Ok() {
      const l = this.form.Luggage, p = this.form.Person
      return (p && p > 0) && (l === null || l >= 0)
    },
    step5Ok() { return !!this.form.Name },
    canGoNext() {
      if (this.step === 0) return this.step1Ok
      if (this.step === 1) return this.step2Ok
      if (this.step === 2) return this.step3Ok
      if (this.step === 3) return this.step4Ok
      return false
    },
    canSubmit() { return this.step5Ok && this.step1Ok && this.step2Ok && this.step3Ok && this.step4Ok }
  },
  async mounted() {
    await this.GetCarMakes()
  },
  methods: {
    SelectLocation(placeId, placeName, Type) {
      if (Type === 'StartLocation') {
        this.SelectedStartLocationSuggestionPlaceId = placeId;
        this.form.StartLocation = placeName;
      } else if (Type === 'DestinationLocation') {
        this.SelectedDestinationLocationSuggestionPlaceId = placeId;
        this.form.DestinationLocation = placeName;
      }

      this.FindSelectedLocationDetails(placeId, Type);

      this.Suggestions = [];
    },
    goToStep(i) {
      if (i <= this.step) { this.step = i; return }
      const guards = [this.step1Ok, this.step2Ok, this.step3Ok, this.step4Ok]
      if (guards.slice(0, i).every(Boolean)) this.step = i
    },
    nextStep() { if (this.step < this.steps.length - 1 && this.canGoNext) this.step += 1 },
    prevStep() { if (this.step > 0) this.step -= 1 },
    previewOnMap() {
      this.$router.push({ name: 'GoogleMaps' });
    },
    async submitWizard() {
      if (!this.canSubmit || this.submitting) return
      this.submitting = true
      try {
      } catch (e) {
        console.error(e)
      } finally {
        this.submitting = false
      }
    },
    resetAll() {
      this.form = {
        StartLocation: null,
        DestinationLocation: null,
        CarBrand: null,
        CarModel: null,
        Engine: null,
        FuelType: null,
        RouteType: null,
        DriveType: null,
        TollPass: [],
        Luggage: null,
        Person: 1,
        Name: "",
        Description: ""
      }
      this.step = 0
    },
    async GetCarMakes() {
      const res = await axios.get("/car/makes")
      if (res.status === 200) this.carBrandItems = res.data.CarBrands
    },
    async FindLocation(e, SuggestionType) {
      var location_name = e.target.value;
      if (!location_name) return;

      if (SuggestionType === 'StartLocation') this.SuggestionType = 'StartLocation';
      else if (SuggestionType === 'DestinationLocation') this.SuggestionType = 'DestinationLocation';

      var res = await axios.post("/google/places", { input: location_name }, {});
      console.log("/google/places : ", res);
      if (res.status === 200) this.Suggestions = res.data.suggestions;
      else return;
    },
    async FindSelectedLocationDetails(place_id, type) {
      var res = await axios.post("/google/places/detail", { placeId: place_id }, {});
      console.log("google/places/detail : ", res);
      if (res.status === 200) {
        if (type === 'StartLocation') {
          Object.assign(this.store.StartLocation, res.data.location);

          console.log(JSON.stringify(this.store.StartLocation));
        } else if (type === 'DestinationLocation') {
          Object.assign(this.store.DestinationLocation, res.data.location);
        }
      } else return;
    }
  }
}
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
