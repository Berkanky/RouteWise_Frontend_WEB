<template>
  <section class="min-h-[88vh] w-full px-4 sm:px-6 py-10 flex items-center justify-center bg-white">
    <div class="w-full max-w-md bg-white rounded-2xl ring-1 ring-zinc-100 shadow-sm px-6 py-10">
      <!-- Back -->
      <button
        type="button"
        @click="goBackLogin"
        class="mb-6 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded-md px-1 -mx-1"
        aria-label="Back to Login"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Login
      </button>

      <!-- Title -->
      <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 text-center tracking-tight">
        Enter your security code
      </h1>
      <p class="mt-2 text-sm text-zinc-600 text-center">
        Enter the 6-digit code from your authenticator app
      </p>

      <!-- OTP boxes -->
      <div class="mt-6 flex justify-center gap-2 md:gap-3" @paste.prevent="onPaste">
        <input
          v-for="(v, i) in code"
          :key="i"
          ref="box"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]*"
          maxlength="1"
          :value="v"
          :aria-label="'Code digit ' + (i + 1)"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          class="h-12 w-10 md:h-14 md:w-12 text-center text-lg md:text-xl font-medium
                 text-zinc-900 rounded-lg
                 bg-rose-50/40 ring-1 ring-inset ring-rose-200/60
                 focus:bg-white focus:ring-2 focus:ring-rose-300
                 outline-none transition"
        />
      </div>

      <!-- Error -->
      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>

      <!-- Submit -->
      <div class="mt-6 w-full">
        <button
          type="button"
          :disabled="loading || otpString.length !== 6"
          @click="onSubmit"
          class="w-full rounded-full bg-zinc-900 hover:bg-black text-white font-semibold py-3 text-sm shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/25 transition"
        >
          <span v-if="!loading">Verify</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3"/>
            </svg>
            Verifying…
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>

import axios from "axios";
import { UseStore } from "../stores/store";

export default {
  name: "LoginTOTPVerifyPage",
  setup() {
    const store = UseStore();
    return { store };
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
    this.$nextTick(() => {
      var first = this.$refs.box?.[0];
      if (first) first.focus();
    });
  },
  beforeRouteLeave(to, from){
    this.store.LoginData = {};
  },
  methods: {
    goBackLogin() {
      this.$router.replace({ name: "Login" });
    },
    onInput(i, e) {

      var val = (e.target.value || "").replace(/\D/g, "");

      this.code[i] = val.slice(-1);

      var next = this.$refs.box?.[i + 1];

      if (val && next) next.focus();
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
      var text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
      if (!text) return;
      for (let i = 0; i < 6; i++) {
        this.code[i] = text[i] || "";
      }
      var idx = Math.min(text.length, 5);
      var el = this.$refs.box?.[idx];
      if (el) el.focus();
    },
    async onSubmit() {

      this.error = "";

      if (this.otpString.length !== 6) return;

      try {

        this.loading = true;
        var res = await axios.post("/TOTP/verify", {
          Code: this.otpString,
          IsRemindDeviceActive: this.store.LoginData.IsRemindDeviceActive,
        });

        if( res.status !== 200 ) return this.error = res.data.message;

        this.store.UserData.Active = true;

        var redir = this.$route.query.redirect;
        if (typeof redir === "string" && redir) return this.$router.replace(redir);
  
        this.$router.push({ name: 'Home', query:{ Page: 1 } });

      } catch (e) {

        this.error = e?.response?.data?.message || "Invalid or expired code. Please try again.";
        this.code = ["", "", "", "", "", ""];
        var first = this.$refs.box?.[0];
        if (first) return first.focus();

      } finally {

        return this.loading = false;
      }
    }
  }
};
</script>