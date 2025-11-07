<template>
  <section class="mx-auto w-full max-w-md sm:max-w-lg px-4 sm:px-6 pt-16 pb-12 flex items-center justify-center">
    <div class="w-full">
      <header class="mb-6 sm:mb-8">
        <h1 class="text-center text-2xl md:text-3xl font-bold text-zinc-900">
          Verify it’s you
        </h1>
        <p class="mt-2 text-center text-sm text-zinc-600">
          Use your authenticator app or a backup code.
        </p>
      </header>
      <div class="md:rounded-3xl md:border md:border-zinc-200 md:bg-white md:shadow-sm p-6 sm:p-10">
        <TabGroup :selectedIndex="tabIndex" @change="tabIndex = $event">
          <TabList class="grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 p-1">
            <Tab v-slot="{ selected }" as="template">
              <button
                class="w-full rounded-md py-2 text-sm font-medium transition focus:outline-none"
                :class="selected
                  ? 'bg-white shadow border border-zinc-200 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900'"
              >
                Authenticator Code
              </button>
            </Tab>
            <Tab v-slot="{ selected }" as="template">
              <button
                class="w-full rounded-md py-2 text-sm font-medium transition focus:outline-none"
                :class="selected
                  ? 'bg-white shadow border border-zinc-200 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900'"
              >
                Backup Code
              </button>
            </Tab>
          </TabList>
          <TabPanels class="mt-5">
            <TabPanel>
              <form @submit.prevent="onSubmit" novalidate>
                <label class="block text-sm font-medium text-zinc-800 mb-1">
                  6‑digit code
                </label>
                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z" />
                    </svg>
                  </span>
                  <input
                    v-model.trim="totpCode"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    maxlength="6"
                    placeholder="123456"
                    autocomplete="one-time-code"
                    class="w-full rounded-lg border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 pl-10 pr-3 py-3 tracking-widest text-center outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
                    @input="totpCode = totpCode.replace(/\D/g, '').slice(0, 6)"
                  />
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-zinc-600">Time‑based 6‑digit code.</span>
                  <a
                    href="/login"
                    class="text-xs underline text-black hover:text-zinc-800"
                    v-float-tip="'Back to sign in.'"
                  >
                    Sign in
                  </a>
                </div>
                <p v-if="error" class="mt-4 text-sm text-red-600">
                  {{ error }}
                </p>
                <button
                  :disabled="loading || totpCode.length !== 6"
                  class="mt-6 w-full rounded-full bg-black hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
                >
                  <span v-if="!loading">Continue</span>
                  <span v-else class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                    </svg>
                    Verifying…
                  </span>
                </button>
              </form>
            </TabPanel>
            <TabPanel>
              <form @submit.prevent="onSubmit" novalidate>
                <label class="block text-sm font-medium text-zinc-800 mb-1">
                  Backup code
                </label>
                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2a6 6 0 1 0 4.24 10.24l3.39 3.39V19h-3v3h-3v-3h-2.36l-1.05-1.05 2.41-2.41A6 6 0 0 0 14 2Z" />
                    </svg>
                  </span>
                  <input
                    v-model.trim="backupCode"
                    type="text"
                    placeholder="e.g. BDQMM-KSG49"
                    class="w-full rounded-lg border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 pl-10 pr-3 py-3 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
                    @input="backupCode = backupCode
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .replace(/(.{5})/g, '$1-')
                      .replace(/-$/, '')
                      .slice(0, 11)"
                  />
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-zinc-600">One‑time use. It will be invalidated after success.</span>
                  <a
                    href="/login"
                    class="text-xs underline text-black hover:text-zinc-800"
                    v-float-tip="'Back to sign in.'"
                  >
                    Sign in
                  </a>
                </div>
                <p v-if="error" class="mt-4 text-sm text-red-600">
                  {{ error }}
                </p>
                <button
                  :disabled="loading || backupCode.length < 8"
                  class="mt-6 w-full rounded-full bg-black hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
                >
                  <span v-if="!loading">Continue</span>
                  <span v-else class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                    </svg>
                    Verifying…
                  </span>
                </button>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { computePosition, offset, flip, shift, autoUpdate } from "@floating-ui/dom";

export default {
  name: "PasswordResetVerifyPage",
  components: { TabGroup, TabList, Tab, TabPanels, TabPanel },
  data() {
    return {
      tabIndex: 0,
      totpCode: "",
      backupCode: "",
      loading: false,
      error: "",
    };
  },
  methods: {
    uniformFail() {
      this.error = "Verification failed. Please try again.";
    },
    async onSubmit() {
      this.error = "";
      this.loading = true;
      try {

        var Code = this.tabIndex === 0 ? this.totpCode : this.backupCode;
        var Type = this.tabIndex === 0 ? "authenticator_app_code" : "backup_code";

        if (Type === "authenticator_app_code" && Code.replace(/\D/g, "").length !== 6) return this.loading = false;

        if (Type === "backup_code") {
          var re = /^[A-Z0-9]{5}-[A-Z0-9]{5}$/;
          if (!re.test(Code)) {
            this.loading = false;
            this.error = "Backup code format is invalid. Example: BDQMM-KSG49";
            return;
          }
        }

        var res = await axios.post("/password/reset/verify", { Code, Type });
        if (res.status !== 200) return this.error = res.data.message;

        this.$router.push({ name: "PasswordReset", query:{ Type: Type } });

      } catch {

        return this.uniformFail();
      } finally {

        return this.loading = false;
      }
    },
  },
  directives: {
    floatTip: {
      mounted(el, binding) {
        let tooltipEl = null, cleanup = null;
        const show = () => {
          if (tooltipEl) return;
          tooltipEl = document.createElement("div");
          tooltipEl.textContent = binding.value || "";
          tooltipEl.className = "pointer-events-none z-50 rounded-md bg-black text-white text-xs px-2 py-1 shadow-lg";
          document.body.appendChild(tooltipEl);
          cleanup = autoUpdate(el, tooltipEl, () => {
            computePosition(el, tooltipEl, {
              placement: "top",
              middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
              Object.assign(tooltipEl.style, {
                position: "fixed",
                left: `${x}px`,
                top: `${y}px`,
              });
            });
          });
        };
        const hide = () => {
          if (cleanup) cleanup();
          cleanup = null;
          if (tooltipEl) {
            tooltipEl.remove();
            tooltipEl = null;
          }
        };
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("focus", show);
        el.addEventListener("blur", hide);
        el._floatTipDestroy = () => {
          el.removeEventListener("mouseenter", show);
          el.removeEventListener("mouseleave", hide);
          el.removeEventListener("focus", show);
          el.removeEventListener("blur", hide);
          hide();
        };
      },
      unmounted(el) {
        if (el._floatTipDestroy) el._floatTipDestroy();
      },
    },
  },
};
</script>

<style scoped>
input[autocomplete="one-time-code"] {
  letter-spacing: 0.3em;
}
</style>