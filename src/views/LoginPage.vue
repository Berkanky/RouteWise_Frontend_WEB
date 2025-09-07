<template>
  <!-- Section Container with centered content and soft background -->
  <section
    class="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-16 pb-12 flex items-center justify-center"
  >
    <!-- Card with two-column layout -->
    <div
      class="w-full overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-md grid grid-cols-1 md:grid-cols-2"
    >
      <!-- Left: Login form -->
      <div class="p-6 md:p-10 order-2 md:order-1">
        <div class="mb-8">
          <p
            class="text-xs uppercase tracking-wider text-rose-500 mb-1 font-semibold"
          >
            Welcome back
          </p>
          <h1 class="text-2xl md:text-3xl font-bold text-zinc-900">
            Sign in to your account
          </h1>
          <p class="mt-1 text-sm text-zinc-500">
            Continue your journey with RouteWise
          </p>
        </div>
        <form @submit.prevent="onSubmit" novalidate>
          <!-- Username -->
          <label
            class="block text-sm font-medium text-zinc-800 mb-1"
            for="login-username"
          >
            Username
          </label>
          <div class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-3 flex items-center"
            >
              <!-- User icon -->
              <svg
                class="h-4 w-4 text-rose-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                />
              </svg>
            </span>
            <input
              id="login-username"
              v-model.trim="form.UserName"
              type="text"
              autocomplete="username"
              placeholder="Enter your username"
              class="w-full rounded-lg border border-rose-200/60 bg-rose-50/40 pl-10 pr-3 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition"
            />
          </div>

          <!-- Password -->
          <div class="mt-5">
            <label
              class="block text-sm font-medium text-zinc-800 mb-1"
              for="login-password"
            >
              Password
            </label>
            <div class="relative">
              <span
                class="pointer-events-none absolute inset-y-0 left-3 flex items-center"
              >
                <!-- Lock icon -->
                <svg
                  class="h-4 w-4 text-rose-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 8v-3h2v3h-2ZM9 9V7a3 3 0 1 1 6 0v2H9Z"
                  />
                </svg>
              </span>
              <input
                id="login-password"
                v-model="form.Password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                class="w-full rounded-lg border border-rose-200/60 bg-rose-50/40 pl-10 pr-10 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-2 flex items-center rounded px-2 text-xs font-medium text-rose-600 hover:text-rose-800 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <!-- Remember and Forgot -->
          <div class="mt-4 flex items-center justify-between">
            <label
              class="inline-flex items-center gap-2 text-sm text-zinc-700 select-none"
            >
              <input
                id="remember"
                type="checkbox"
                v-model="form.IsRemindDeviceActive"
                class="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
              />
              <span>Remember this device</span>
            </label>
            <RouterLink
              to="/password/reset/start"
              class="text-xs underline text-rose-500 hover:text-rose-700"
            >
              Forgot password?
            </RouterLink>
          </div>

          <!-- Error message -->
          <p v-if="error" class="mt-4 text-sm text-red-600">
            {{ error }}
          </p>

          <!-- Submit button -->
          <button
            :disabled="loading"
            class="mt-6 w-full rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
          >
            <span v-if="!loading">Log in</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg
                class="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
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
              Processing…
            </span>
          </button>

          <p class="mt-6 text-center text-sm text-zinc-600">
            Don't have an account?
            <RouterLink
              to="/register"
              class="underline text-rose-600 hover:text-rose-800"
            >
              Sign up
            </RouterLink>
          </p>
        </form>
      </div>

      <!-- Right: Illustration -->
      <div
        class="order-1 md:order-2 bg-rose-50 border-b md:border-b-0 md:border-l border-rose-200 hidden md:block"
      >
        <div class="h-56 md:h-full">
          <img
            src="../images/RouteWiseMapV2.jpg"
            alt="Login illustration"
            class="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>
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
      form: { UserName: "", Password: "", IsRemindDeviceActive: true },
      showPassword: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async onSubmit() {
      this.error = "";
      if (!this.form.UserName || !this.form.Password) {
        this.error = "Please fill in both fields.";
        return;
      }
      try {
        this.loading = true;
        const res = await axios.post("/login", {
          UserName: this.form.UserName,
          Password: this.form.Password,
        });
        if (res.status === 200) {
          this.store.LoginData = this.form;
          this.$router.push({ name: "LoginTOTPVerify" });
        }
      } catch (e) {
        this.error = e?.response?.data?.message || "Login failed.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>