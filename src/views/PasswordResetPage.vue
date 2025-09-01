<template>
  <section class="mx-auto w-full max-w-xl px-4 sm:px-6">
    <!-- Success Banner -->
    <div v-if="success" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 flex items-start gap-2" role="status" aria-live="polite">
      <svg class="h-5 w-5 mt-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14-4-4 1.414-1.414L11 12.172l5.586-5.586L18 8l-7 8Z"/>
      </svg>
      <div class="text-sm">
        <strong>Password updated.</strong> Redirecting to sign in…
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 md:p-6">
      <header class="mb-6 sm:mb-8">
        <h1 class="text-center text-2xl md:text-[26px] font-semibold text-zinc-900">
          Set a new password
        </h1>
        <p class="mt-2 text-center text-sm text-zinc-600">
          Choose a strong password you haven’t used before.
        </p>
      </header>
      <form @submit.prevent="onSubmit" novalidate>
        <!-- PASSWORD -->
        <label class="block text-sm font-medium text-zinc-800 mb-1">New password</label>
        <div class="relative">
          <input
            :type="showPass ? 'text' : 'password'"
            v-model.trim="password"
            autocomplete="new-password"
            class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400
                   text-zinc-900 pr-10 pl-3 py-3 outline-none focus:bg-white focus:border-rose-300"
            placeholder="••••••••"
            @input="touch=true"
            :disabled="success"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-800"
            @click="showPass = !showPass"
            aria-label="Toggle password visibility"
            :disabled="success">
            <svg v-if="!showPass" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5Zm0 11.25A3.75 3.75 0 1 1 12 8.25a3.75 3.75 0 0 1 0 7.5Z"/></svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="m3.28 2.22 18.5 18.5-1.06 1.06-3.09-3.1A12.27 12.27 0 0 1 12 19.5C7 19.5 2.73 16.39 1 12c.84-2.12 2.3-3.9 4.12-5.17L2.22 3.28 3.28 2.22Zm8.72 5.03a3.75 3.75 0 0 1 3.75 3.75c0 .5-.1.98-.28 1.42l-4.89-4.89c.44-.18.92-.28 1.42-.28Z"/></svg>
          </button>
        </div>

        <!-- Hints -->
        <ul class="mt-2 space-y-1 text-xs">
          <li :class="hintClass(minLenOk)">• At least 8 characters</li>
          <li :class="hintClass(upperOk)">• Uppercase letter</li>
          <li :class="hintClass(lowerOk)">• Lowercase letter</li>
          <li :class="hintClass(numberOk)">• Number</li>
          <li :class="hintClass(symbolOk)">• Symbol</li>
        </ul>

        <!-- CONFIRM -->
        <label class="block text-sm font-medium text-zinc-800 mt-5 mb-1">Confirm password</label>
        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model.trim="confirmPassword"
            autocomplete="new-password"
            class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400
                   text-zinc-900 pr-10 pl-3 py-3 outline-none focus:bg-white focus:border-rose-300"
            placeholder="••••••••"
            :disabled="success"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-800"
            @click="showConfirm = !showConfirm"
            aria-label="Toggle confirm password visibility"
            :disabled="success">
            <svg v-if="!showConfirm" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5Zm0 11.25A3.75 3.75 0 1 1 12 8.25a3.75 3.75 0 0 1 0 7.5Z"/></svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="m3.28 2.22 18.5 18.5-1.06 1.06-3.09-3.1A12.27 12.27 0 0 1 12 19.5C7 19.5 2.73 16.39 1 12c.84-2.12 2.3-3.9 4.12-5.17L2.22 3.28 3.28 2.22Zm8.72 5.03a3.75 3.75 0 0 1 3.75 3.75c0 .5-.1.98-.28 1.42l-4.89-4.89c.44-.18.92-.28 1.42-.28Z"/></svg>
          </button>
        </div>

        <!-- Error -->
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

        <!-- Submit -->
        <button
          :disabled="loading || !formOk || success"
          class="mt-6 w-full rounded-full bg-rose-500 hover:bg-rose-600
                 disabled:opacity-60 disabled:cursor-not-allowed
                 text-white font-semibold py-3 text-sm shadow-sm transition">
          <span v-if="!loading">Save new password</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3"/>
            </svg>
            Saving…
          </span>
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "PasswordResetPage",
  data() {
    return {
      password: "",
      confirmPassword: "",
      showPass: false,
      showConfirm: false,
      loading: false,
      error: "",
      touch: false,
      success: false,       // <-- eklendi
      redirectTimer: null,  // <-- eklendi
    };
  },
  computed: {
    minLenOk() { return this.password.length >= 8; },
    upperOk()  { return /[A-Z]/.test(this.password); },
    lowerOk()  { return /[a-z]/.test(this.password); },
    numberOk() { return /[0-9]/.test(this.password); },
    symbolOk() { return /[^A-Za-z0-9]/.test(this.password); },
    strongOk() { return this.minLenOk && this.upperOk && this.lowerOk && this.numberOk && this.symbolOk; },
    matchOk()  { return this.confirmPassword.length > 0 && this.password === this.confirmPassword; },
    formOk()   { return this.strongOk && this.matchOk; },
  },
  methods: {
    hintClass(ok) {
      return ok ? "text-emerald-600" : "text-zinc-500";
    },
    uniformFail() {
      this.error = "Something went wrong. Please try again.";
    },
    async onSubmit() {
      this.error = "";
      if (!this.formOk || this.success) return;
      this.loading = true;

      try {
        const res = await axios.post("/password/reset/complete", {
          Password: this.password,
          PasswordConfirm: this.confirmPassword
        });

        if (res.status === 200) {
          // Success mesajını göster, 2 saniye sonra Login'e yönlendir
          this.success = true;
          this.redirectTimer = setTimeout(() => {
            this.$router.push({ name: "Login" });
          }, 2000);
        } else {
          this.error = res?.data?.message || "Please try again.";
        }
      } catch (e) {
        this.uniformFail();
      } finally {
        this.loading = false;
      }
    },
  },
  beforeUnmount() {
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
  }
};
</script>