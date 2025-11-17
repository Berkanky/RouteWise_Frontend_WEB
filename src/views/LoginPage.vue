<template>
  <section
    class="min-h-[88vh] w-full px-4 sm:px-6 py-8 sm:py-10
           flex items-start md:items-center justify-center bg-white"
  >
    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2
             bg-white
             md:rounded-3xl md:ring-1 md:ring-zinc-100
             md:shadow-[0_18px_55px_rgba(15,23,42,0.08)]
             md:overflow-hidden"
    >
      <!-- Sol: Form -->
      <div class="w-full px-5 sm:px-8 md:px-12 py-8 md:py-14 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">
          <img
            src="../images/AppIconRouteWise-4 1.svg"
            alt="Routewise"
            class="w-16 h-16 sm:w-20 sm:h-20 mx-auto md:mx-0 mb-5 sm:mb-7"
          />

          <h1
            class="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2"
          >
            Welcome to RouteWise
          </h1>
          <p class="text-sm text-zinc-500 mb-7">
            Login and unlock smarter travel with RouteWise.
          </p>

          <form @submit.prevent="onSubmit" novalidate class="text-left space-y-4">
            <!-- Username -->
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                id="username"
                v-model.trim="form.UserName"
                type="text"
                autocomplete="username"
                placeholder="username"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                       ring-1 ring-inset ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/20 outline-none transition"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.Password"
                autocomplete="current-password"
                placeholder="********"
                :aria-invalid="!!error"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                       ring-1 ring-inset ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/20 outline-none transition"
              />
            </div>

            <!-- Remember + Forgot -->
            <div class="flex items-center justify-between pt-1">
              <label
                for="remember"
                class="flex items-center gap-2 text-sm text-zinc-700 select-none cursor-pointer"
              >
                <input
                  id="remember"
                  type="checkbox"
                  v-model="form.IsRemindDeviceActive"
                  class="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
                />
                <span>Remember this device</span>
              </label>

              <RouterLink
                to="/password/reset/start"
                class="text-sm font-medium text-zinc-900 hover:opacity-80 underline underline-offset-2"
              >
                Forgot password?
              </RouterLink>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-red-600 text-sm text-center">
              {{ error }}
            </p>

            <!-- Submit -->
            <button
              :disabled="loading"
              class="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-zinc-900 to-black text-white
                       font-semibold shadow-sm hover:opacity-95 active:opacity-90
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/25 transition"
            >
              <span v-if="!loading">Continue</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                Processing…
              </span>
            </button>

            <!-- Signup -->
            <p class="pt-4 text-center text-sm text-zinc-600">
              Don’t have an account?
              <RouterLink
                to="/register"
                class="text-zinc-900 underline underline-offset-2 hover:opacity-80 font-medium"
              >
                Sign up
              </RouterLink>
            </p>
          </form>
        </div>
      </div>

      <!-- Sağ: Görsel -->
      <div class="hidden md:block relative">
        <img
          src="../images/background.jpg"
          alt="Routes illustration"
          class="w-full h-full object-cover"
        />
        <div
          class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/60 to-transparent"
        ></div>
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
