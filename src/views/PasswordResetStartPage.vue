<template>
  <section class="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-12 pb-8 flex items-start justify-center min-h-[80vh]">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 md:bg-white md:border md:border-zinc-200 md:rounded-xl md:shadow-sm overflow-hidden">
      <div class="w-full px-4 py-10 sm:px-6 md:px-12 md:py-16 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">
          <img src="../images/AppIconRouteWise-4 1.svg" alt="Routewise Logo" class="w-20 h-20 mx-auto md:mx-0 mb-8" />
          <h1 class="text-2xl font-bold text-black mb-2">Reset your password</h1>
          <p class="text-sm text-zinc-500 mb-8">
            Enter your username to start the reset process.
          </p>
          <form @submit.prevent="onSubmit" novalidate>
            <div class="mb-4">
              <input
                v-model.trim="form.UserName"
                type="text"
                autocomplete="username"
                placeholder="username"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
              />
            </div>
            <p class="text-xs text-zinc-500 mb-4">
              We’ll continue if an account exists for this username.
            </p>
            <p v-if="error" class="text-red-500 text-sm text-center mb-4">
              {{ error }}
            </p>
            <button
              type="submit"
              :disabled="loading || !form.UserName"
              class="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
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
              Remembered your password?
              <RouterLink
                to="/login"
                class="text-black underline hover:text-zinc-800 font-medium"
              >
                Sign in
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
      <div class="hidden md:block bg-zinc-100">
        <img src="../images/background.jpg" alt="Reset Illustration" class="w-full h-full object-cover" />
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "PasswordResetStartPage",
  data() {
    return {
      form: { UserName: "" },
      loading: false,
      error: "",
    };
  },
  methods: {
    async onSubmit() {

      this.error = "";
      if (!this.form.UserName) return this.error = "Please enter your username.";

      try {

        this.loading = true;
        var res = await axios.post("/password/reset/start", {
          UserName: this.form.UserName,
        });

        if (res.status !== 200) return this.error = res.data.message;
        this.$router.push({ name: "PasswordResetVerify" });

      } catch (e) {

        return this.error = "We’ll continue if an account exists for this username.";
      } finally {
        return this.loading = false;
      }
    },
  },
};
</script>