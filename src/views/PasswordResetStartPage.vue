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
      <div class="w-full px-6 sm:px-8 md:px-12 py-10 md:py-14 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">
          
          <img
            src="../images/AppIconRouteWise-4 1.svg"
            alt="Routewise Logo"
            class="w-16 h-16 sm:w-20 sm:h-20 mx-auto md:mx-0 mb-6 sm:mb-8"
          />

          <h1
            class="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2"
          >
            Reset your password
          </h1>

          <p class="text-sm text-zinc-600 mb-8">
            Enter your username to start the reset process.
          </p>

          <form @submit.prevent="onSubmit" novalidate class="space-y-3">

            <!-- Input -->
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                id="username"
                v-model.trim="form.UserName"
                type="text"
                autocomplete="username"
                placeholder="username"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                       ring-1 ring-inset ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-zinc-900/20
                       outline-none transition"
              />
            </div>

            <p class="text-xs text-zinc-500">
              We’ll continue if an account exists for this username.
            </p>

            <!-- Error -->
            <p v-if="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </p>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading || !form.UserName"
              class="w-full mt-1 py-3 rounded-full bg-gradient-to-r from-zinc-900 to-black text-white
                     font-semibold shadow-sm hover:opacity-95 active:opacity-90
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/25 transition"
            >
              <span v-if="!loading">Continue</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                </svg>
                Processing…
              </span>
            </button>

            <p class="pt-4 text-center text-sm text-zinc-600">
              Remembered your password?
              <RouterLink
                to="/login"
                class="text-zinc-900 underline underline-offset-2 hover:opacity-80 font-medium"
              >
                Sign in
              </RouterLink>
            </p>
          </form>
        </div>
      </div>

      <!-- Sağ: Görsel -->
      <div class="hidden md:block relative">
        <img
          src="../images/background.jpg"
          alt="Reset illustration"
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