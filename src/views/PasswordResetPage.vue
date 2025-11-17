<template>
  <section
    class="min-h-[88vh] w-full px-4 sm:px-6 py-8 sm:py-10
           flex items-start md:items-center justify-center bg-zinc-50"
  >
    <div class="w-full max-w-lg">
      <!-- Success alert -->
      <div
        v-if="success"
        class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 flex items-start gap-2"
        role="status"
        aria-live="polite"
      >
        <svg class="h-5 w-5 mt-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14-4-4 1.414-1.414L11 12.172l5.586-5.586L18 8l-7 8Z"
          />
        </svg>
        <div class="text-sm">
          <strong>Password updated.</strong> Choose your next step.
        </div>
      </div>

      <!-- Card (mobile'de düz, md+ card) -->
      <div
        class="px-0 sm:px-2 md:px-8 py-0 sm:py-2 md:py-8
               md:rounded-3xl md:bg-white md:ring-1 md:ring-zinc-100
               md:shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
      >
        <header class="mb-6 sm:mb-7 text-center">
          <h1 class="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            Set a new password
          </h1>
          <p class="mt-2 text-sm text-zinc-600">
            Choose a strong password you haven’t used before.
          </p>
        </header>

        <form @submit.prevent="onSubmit" novalidate class="space-y-5">
          <!-- New password -->
          <div>
            <label class="block text-sm font-medium text-zinc-800 mb-1">
              New password
            </label>
            <div class="relative">
              <input
                :type="showPass ? 'text' : 'password'"
                v-model.trim="password"
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="success"
                class="w-full rounded-lg bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 pr-10 pl-3 py-3
                       ring-1 ring-inset ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/20
                       outline-none transition"
                @input="touch = true"
              />
              <button
                type="button"
                :disabled="success"
                @click="showPass = !showPass"
                aria-label="Toggle password visibility"
                class="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
              >
                <svg
                  v-if="!showPass"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5Zm0 11.25A3.75 3.75 0 1 1 12 8.25a3.75 3.75 0 0 1 0 7.5Z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="m3.28 2.22 18.5 18.5-1.06 1.06-3.09-3.1A12.27 12.27 0 0 1 12 19.5C7 19.5 2.73 16.39 1 12c.84-2.12 2.3-3.9 4.12-5.17L2.22 3.28 3.28 2.22Zm8.72 5.03a3.75 3.75 0 0 1 3.75 3.75c0 .5-.1.98-.28 1.42l-4.89-4.89c.44-.18.92-.28 1.42-.28Z"
                  />
                </svg>
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
          </div>

          <!-- Confirm -->
          <div>
            <label class="block text-sm font-medium text-zinc-800 mb-1">
              Confirm password
            </label>
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model.trim="confirmPassword"
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="success"
                class="w-full rounded-lg bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 pr-10 pl-3 py-3
                       ring-1 ring-inset ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/20
                       outline-none transition"
              />
              <button
                type="button"
                :disabled="success"
                @click="showConfirm = !showConfirm"
                aria-label="Toggle confirm password visibility"
                class="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
              >
                <svg
                  v-if="!showConfirm"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5Zm0 11.25A3.75 3.75 0 1 1 12 8.25a3.75 3.75 0 0 1 0 7.5Z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="m3.28 2.22 18.5 18.5-1.06 1.06-3.09-3.1A12.27 12.27 0 0 1 12 19.5C7 19.5 2.73 16.39 1 12c.84-2.12 2.3-3.9 4.12-5.17L2.22 3.28 3.28 2.22Zm8.72 5.03a3.75 3.75 0 0 1 3.75 3.75c0 .5-.1.98-.28 1.42l-4.89-4.89c.44-.18.92-.28 1.42-.28Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            v-if="!success"
            type="submit"
            :disabled="loading || !formOk || success"
            class="mt-2 w-full rounded-full bg-zinc-900 hover:bg-black text-white font-semibold py-3 text-sm shadow-sm
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/25 transition"
          >
            <span v-if="!loading">Save new password</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg
                class="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
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
              Saving…
            </span>
          </button>
        </form>

        <!-- Success actions -->
        <div v-if="success" class="mt-6 border-t border-zinc-100 pt-5">
          <p class="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Next steps
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-if="this.Type == 'backup_code'"
              type="button"
              v-on:click="this.go_totp_setup_page()"
              class="group rounded-2xl bg-white ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 p-4 shadow-sm transition flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 3a1 1 0 0 1 1 1v5.382l3.447 2.3a1 1 0 0 1-1.1 1.664l-4-2.667A1 1 0 0 1 11 12V6a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-zinc-900">TOTP Setup</div>
                  <div class="text-xs text-zinc-500">Authenticator’ı yeniden kur</div>
                </div>
              </div>
              <svg
                class="h-5 w-5 text-zinc-400 group-hover:text-zinc-700"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9.293 6.293a1 1 0 0 1 1.414 0L16.414 12l-5.707 5.707a1 1 0 0 1-1.414-1.414L13.586 12 9.293 7.707a1 1 0 0 1 0-1.414Z"
                />
              </svg>
            </button>

            <button
              type="button"
              v-on:click="this.go_login_page();"
              class="group rounded-2xl bg-white ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 p-4 shadow-sm transition flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3a1 1 0 1 0 0 2h6v14h-6a1 1 0 1 0 0 2h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-7Zm.293 6.293a1 1 0 1 0-1.414 1.414L10.586 12l-1.707 1.707a1 1 0 1 0 1.414 1.414L13.414 12l-3.121-2.707Z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-zinc-900">Login Page</div>
                  <div class="text-xs text-zinc-500">Giriş sayfasına dön</div>
                </div>
              </div>
              <svg
                class="h-5 w-5 text-zinc-400 group-hover:text-zinc-700"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9.293 6.293a1 1 0 0 1 1.414 0L16.414 12l-5.707 5.707a1 1 0 0 1-1.414-1.414L13.586 12 9.293 7.707a1 1 0 0 1 0-1.414Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { UseStore } from '../stores/store';
export default {
  name: "PasswordResetPage",
  data() {
    return {
      Type: "",
      password: "",
      confirmPassword: "",
      showPass: false,
      showConfirm: false,
      loading: false,
      error: "",
      touch: false,
      success: false,
      redirectTimer: null,
    };
  },
  setup(){
    const store = UseStore();
    return{
      store
    }
  },
  computed: {
    minLenOk()   { return this.password.length >= 8; },
    upperOk()    { return /[A-Z]/.test(this.password); },
    lowerOk()    { return /[a-z]/.test(this.password); },
    numberOk()   { return /[0-9]/.test(this.password); },
    symbolOk()   { return /[^A-Za-z0-9]/.test(this.password); },
    strongOk()   { return this.minLenOk && this.upperOk && this.lowerOk && this.numberOk && this.symbolOk; },
    matchOk()    { return this.confirmPassword.length > 0 && this.password === this.confirmPassword; },
    formOk()     { return this.strongOk && this.matchOk; },
  },
  created(){
    var { Type } = this.$route.query;
    this.Type = Type;
  },
  methods: {
    async go_totp_setup_page(){

      this.error = "";
      this.loading = true;

      try{
        var res = await axios.post("/start/TOTP/setup");
        if( res.status !== 200 ) return this.error = res.data.message || "Please try again.";

        this.store.TOTPSetupData.QRDataUrl = res.data.QRDataUrl;
        this.store.TOTPSetupData.ManualSecret = res.data.ManualSecret;
        this.store.TOTPSetupData.UserName = res.data.UserName;
        
        this.$router.push({ name: "TOTPVerify"});
      }catch(err){

        this.error = err?.response?.data?.message || "Please try again. ";
      }finally{
        this.loading = false;
      }
    },
    go_login_page(){
      this.$router.push({ name: 'Login' });
    },
    hintClass(ok) {
      return ok ? "text-emerald-600" : "text-zinc-500";
    },
    uniformFail() {
      this.error = "Something went wrong. Please try again.";
    },
    async onSubmit() {
      if (!this.formOk || this.success) return;

      this.error = "";
      this.loading = true;

      try {
        var res = await axios.post("/password/reset/complete", {
          Password: this.password,
          PasswordConfirm: this.confirmPassword,
          Type: this.Type
        });

        if (res.status !== 200) return this.error = res?.data?.message || "Please try again.";
        
        this.success = true; 
      } catch {

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