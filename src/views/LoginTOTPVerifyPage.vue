<template>
  <section class="mx-auto w-full max-w-2xl">
    <div class="mb-3">
      <button
        type="button"
        @click="goBackLogin"
        class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back To Login
      </button>
    </div>

    <h1 class="text-center text-2xl md:text-[26px] font-semibold text-zinc-900">
      Enter your security code
    </h1>
    <p class="mt-2 text-center text-sm text-zinc-600">
      Enter the 6-digit code from your authenticator app
    </p>

    <!-- OTP boxes -->
    <div
      class="mt-6 flex items-center justify-center gap-2 md:gap-3"
      @paste.prevent="onPaste"
    >
      <input
        v-for="(v, i) in code"
        :key="i"
        ref="box"
        inputmode="numeric"
        autocompvare="one-time-code"
        pattern="[0-9]*"
        maxlength="1"
        :value="v"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        class="h-10 w-10 md:h-12 md:w-12 text-center text-lg md:text-xl font-medium rounded-lg border border-rose-200/60 bg-rose-100/40 text-zinc-900 outline-none focus:bg-white focus:border-rose-300"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="mt-4 text-center text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Submit -->
    <div class="mt-6 flex justify-center">
      <button
        :disabled="loading || otpString.length !== 6"
        @click="onSubmit"
        class="w-full md:w-[380px] rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
      >
        <span v-if="!loading">Verify</span>
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
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { UseStore } from "../stores/store";
import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/dom";

export default {
  name: "LoginTOTPVerifyPage",
  setup() {
    const store = UseStore();
    return{
        store
    }
  },
  data() {
    return {
      code: ["", "", "", "", "", ""],
      loading: false,
      error: "",
    };
  },

  computed: {
    otpString() {
      return this.code.join("");
    },
  },

  mounted() {
    // ilk kutuya odaklan
    this.$nextTick(() => {
      var first = this.$refs.box?.[0];
      if (first) first.focus();
    });
  },

  methods: {
    goBackLogin() {
      this.$router.replace({ name: "Login" });
    },
    onInput(i, e) {
      var val = (e.target.value || "").replace(/\D/g, "");
      if (!val) {
        this.code[i] = "";
        return;
      }
      // tek karakter al
      this.code[i] = val.slice(-1)
      // ileri odak
      var next = this.$refs.box?.[i + 1];
      if (next) next.focus();
    },

    onKeydown(i, e) {
      if (e.key === "Backspace" && !this.code[i]) {
        var prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === "ArrowLeft") {
        var prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === "ArrowRight") {
        var next = this.$refs.box?.[i + 1];
        if (next) next.focus();
      }
    },

    onPaste(e) {
      var text = (e.clipboardData?.getData("text") || "")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!text) return;
      for (let i = 0; i < 6; i++) this.code[i] = text[i] || ""
      // son dolu kutudan sonraya odak
      var idx = Math.min(text.length, 5);
      var el = this.$refs.box?.[idx];
      if (el) el.focus();
    },

    async onSubmit() {
      this.error = "";
      if (this.otpString.length !== 6) return;

      try {
        this.loading = true;
        var res = await axios.post(
          "/TOTP/verify",
          {
            Code: this.otpString,
            IsRemindDeviceActive: this.store.LoginData.IsRemindDeviceActive
          }
        );
        console.log("/TOTP/verify : ", res);
        
        if (res.status === 200) this.$router.push({ name: "Home" });

        // redirect param varsa ona; yoksa /home
        var redir = this.$route.query.redirect;
        if (typeof redir === "string" && redir) this.$router.replace(redir);
        else this.$router.replace({ name: "Home" });
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          "Invalid or expired code. Please try again.";
        // hatada kutuları temizle
        this.code = ["", "", "", "", "", ""];
        var first = this.$refs.box?.[0];
        if (first) first.focus();
      } finally {
        this.loading = false;
      }
    },
  },

  directives: {
    floatTip: {
      mounted(el, binding) {
        var tooltipEl = null;
        var cleanup = null;

        var show = () => {
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

        var hide = () => {
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
