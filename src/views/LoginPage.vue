<template>
  <section class="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 pb-8 flex items-start justify-center min-h-[80vh]">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 
         md:bg-white md:rounded-xl md:border md:border-zinc-250
         md:shadow-sm md:overflow-hidden">
      <div class="w-full px-4 py-10 sm:px-6 md:px-12 md:py-16 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">
          <img src="../images/AppIconRouteWise-4 1.svg" alt="Routewise Logo" class="w-24 h-24 mx-auto md:mx-0 mb-8" />
          <h1 class="text-2xl font-bold text-black mb-2">Welcome to Routewise</h1>
          <p class="text-sm text-zinc-500 mb-8">
            Login and unlock smarter travel with Routewise.
          </p>
          <form @submit.prevent="onSubmit" novalidate class="text-left">
            <div class="mb-4">
              <input v-model.trim="form.UserName" type="text" autocomplete="username" placeholder="username"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition" />
            </div>
            <div class="mb-4">
              <input :type="showPassword ? 'text' : 'password'" v-model="form.Password" autocomplete="current-password"
                placeholder="********"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition" />
            </div>
            <div class="flex items-center mb-6 text-sm text-zinc-700">
              <input id="remember" type="checkbox" v-model="form.IsRemindDeviceActive"
                class="mr-2 rounded border-zinc-300 text-black" />
              <label for="remember">Remember this device</label>
            </div>
            <div class="flex justify-end mb-6">
              <RouterLink to="/password/reset/start"
                class="text-sm text-black underline hover:text-zinc-800 font-medium">
                Forgot password?
              </RouterLink>
            </div>
            <p v-if="error" class="text-red-500 text-sm text-center mt-3">
              {{ error }}
            </p>
            <button :disabled="loading"
              class="w-full py-3 rounded-full bg-gradient-to-r from-zinc-900 to-black text-white font-semibold shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!loading">Continue</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                </svg>
                Processing…
              </span>
            </button>
            <p class="mt-6 text-center text-sm text-zinc-600">
              Don’t have an account?
              <RouterLink to="/register" class="text-black underline hover:text-zinc-800 font-medium">
                Sign up
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
      <div class="hidden md:block bg-zinc-100">
        <img src="../images/background.jpg" alt="Login Illustration" class="w-full h-full object-cover" />
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { UseStore } from "../stores/store";

export default {
  name: "LoginPage",
  setup() {
    const store = UseStore();
    return { store };
  },
  data() {
    return {
      form: {
        UserName: "",
        Password: "",
        IsRemindDeviceActive: true,
      },
      showPassword: false,
      loading: false,
      error: "",
    };
  },
  created() {
    this.store.ResetPiniaStore();
  },
  methods: {
    async onSubmit() {

      this.error = "";

      if (!this.form.UserName || !this.form.Password) return this.error = "Please fill in both fields.";

      try {
        this.loading = true;
        var res = await axios.post("/login", {
          UserName: this.form.UserName,
          Password: this.form.Password,
        });

        if (res.status !== 200) return this.error = res.data.message;

        this.store.LoginData = this.form;
        this.$router.push({ name: "LoginTOTPVerify" });

      } catch (e) {

        return this.error = e?.response?.data?.message || "Login failed.";
      } finally {
        
        return this.loading = false;
      }
    },
  },
};
</script>
