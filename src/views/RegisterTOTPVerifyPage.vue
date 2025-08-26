<template>
  <section class="mx-auto w-full max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <!-- LEFT: QR + MANUAL SECRET -->
      <div>
        <h1 class="text-2xl md:text-[26px] font-semibold text-zinc-900">
          Set up two-factor authentication
        </h1>
        <p class="mt-2 text-sm text-zinc-600">
          Scan the QR code with your authenticator app or enter the manual key.
        </p>

        <div
          class="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 md:p-6"
        >
          <div class="flex items-start gap-4">
            <!-- QR -->
            <div class="shrink-0">
              <img
                :src="qrDataUrl || placeholderQR"
                alt="TOTP QR Code"
                class="w-[180px] h-[180px] rounded-md border border-zinc-200 object-contain bg-white"
              />
            </div>

            <!-- Manual secret -->
            <div class="grow">
              <label class="block text-sm font-medium text-zinc-800"
                >Manual key</label
              >
              <div class="mt-1 flex items-center gap-2">
                <input
                  :value="manualSecret"
                  readonly
                  class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 font-mono text-sm select-all"
                />
                <button
                  type="button"
                  @click="copySecret"
                  v-float-tip="'Copy manual key'"
                  class="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Copy
                </button>
              </div>

              <p
                class="mt-3 inline-flex items-center gap-2 text-xs text-zinc-600"
              >
                <span
                  class="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 font-medium"
                >
                  App: Microsoft Authenticator
                </span>
                <span>or any TOTP-compatible app</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: VERIFY 6-DIGIT CODE -->
      <div>
        <h2 class="text-xl font-semibold text-zinc-900">
          Enter the 6-digit code
        </h2>
        <p class="mt-2 text-sm text-zinc-600">
          Open the app and type the current code.
        </p>

        <!-- OTP boxes -->
        <div
          class="mt-6 flex items-center justify-start gap-2 md:gap-3"
          @paste.prevent="onPaste"
        >
          <input
            v-for="(v, i) in code"
            :key="i"
            ref="box"
            inputmode="numeric"
            autocomplete="one-time-code"
            pattern="[0-9]*"
            maxlength="1"
            :value="v"
            @input="onInput(i, $event)"
            @keydown="onKeydown(i, $event)"
            class="h-12 w-10 md:h-12 md:w-12 text-center text-lg md:text-xl font-medium rounded-lg border border-rose-200/60 bg-rose-100/40 text-zinc-900 outline-none focus:bg-white focus:border-rose-300"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

        <!-- Submit -->
        <button
          :disabled="loading || otpString.length !== 6"
          @click="onVerify"
          class="mt-6 w-full lg:w-[360px] rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
        >
          <span v-if="!loading">Verify & Complete</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                class="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
              />
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="currentColor"
                stroke-width="3"
              />
            </svg>
            Verifying…
          </span>
        </button>

        <p class="mt-4 text-[13px] text-zinc-600">
          Already registered?
          <RouterLink to="/login" class="underline hover:text-zinc-900"
            >Go to login</RouterLink
          >
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/dom";

export default {
  name: "RegisterTOTPVerify",
  data() {
    return {
      qrDataUrl: "",
      manualSecret: "",
      code: ["", "", "", "", "", ""],
      loading: false,
      error: "",
      placeholderQR:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="100%" height="100%" fill="#f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#71717a">QR Loading…</text></svg>'
        ),
    };
  },
  computed: {
    otpString() {
      return this.code.join("");
    },
  },
  async mounted() {
    // QR + manual secret çek
    try {
      const { data } = await axios.post(
        "/TOTP/setup/start",
        {},
        { withCredentials: true }
      );
      this.qrDataUrl = data?.QRDataUrl || "";
      this.manualSecret = data?.ManualSecret || "";
    } catch (e) {
      this.error = e?.response?.data?.message || "Could not start TOTP setup.";
    }
    // ilk otp kutusuna fokus
    this.$nextTick(() => {
      const first = this.$refs.box?.[0];
      if (first) first.focus();
    });
  },
  methods: {
    async onVerify() {
      this.error = "";
      if (this.otpString.length !== 6) return;
      try {
        this.loading = true;
        var res = await axios.post("/TOTP/setup/verify", {
          Code: this.otpString,
        });

        if (res.status === 200) this.$router.replace({ name: "Login" });
      } catch (e) {
        this.error =
          e?.response?.data?.message || "Invalid code, please try again.";
        this.code = ["", "", "", "", "", ""];
        const first = this.$refs.box?.[0];
        if (first) first.focus();
      } finally {
        this.loading = false;
      }
    },

    copySecret() {
      if (!this.manualSecret) return;
      navigator.clipboard?.writeText(this.manualSecret);
    },

    onInput(i, e) {
      const val = (e.target.value || "").replace(/\D/g, "");
      if (!val) {
        this.code[i] = "";
        return;
      }
      this.code[i] = val.slice(-1);
      const next = this.$refs.box?.[i + 1];
      if (next) next.focus();
    },

    onKeydown(i, e) {
      if (e.key === "Backspace" && !this.code[i]) {
        const prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === "ArrowLeft") {
        const prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === "ArrowRight") {
        const next = this.$refs.box?.[i + 1];
        if (next) next.focus();
      }
    },

    onPaste(e) {
      const text = (e.clipboardData?.getData("text") || "")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!text) return;
      for (let i = 0; i < 6; i++) this.code[i] = text[i] || "";
      const idx = Math.min(text.length, 5);
      const el = this.$refs.box?.[idx];
      if (el) el.focus();
    },
  },

  directives: {
    // v-float-tip="'text'"
    floatTip: {
      mounted(el, binding) {
        let tooltipEl = null;
        let cleanup = null;
        const show = () => {
          if (tooltipEl) return;
          tooltipEl = document.createElement("div");
          tooltipEl.textContent = binding.value || "";
          tooltipEl.className =
            "pointer-events-none z-50 rounded-md bg-black text-white text-xs px-2 py-1 shadow-lg";
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
