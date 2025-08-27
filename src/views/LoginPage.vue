<template>
  <section class="mx-auto w-full max-w-xl px-4 sm:px-6">
    <!-- Heading -->
    <header class="mb-6 sm:mb-8">
      <h1 class="text-center text-2xl md:text-[26px] font-semibold text-zinc-900">
        Welcome back
      </h1>
      <p class="mt-2 text-center text-sm text-zinc-600">
        Please sign in to continue.
      </p>
    </header>

    <!-- Card -->
    <div class="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 md:p-6">
      <form @submit.prevent="onSubmit" novalidate>
        <!-- Username -->
        <label class="block text-sm font-medium text-zinc-800 mb-1">Username</label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <!-- user icon -->
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/>
            </svg>
          </span>
          <input
            v-model.trim="form.UserName"
            type="text"
            autocomplete="username"
            placeholder="Enter your username"
            class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400
                   text-zinc-900 pl-10 pr-3 py-3 outline-none focus:bg-white focus:border-rose-300" />
        </div>

        <!-- Password -->
        <div class="mt-5">
          <label class="block text-sm font-medium text-zinc-800 mb-1">Password</label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <!-- lock icon -->
              <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 8v-3h2v3h-2ZM9 9V7a3 3 0 1 1 6 0v2H9Z"/>
              </svg>
            </span>
            <input
              v-model="form.Password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
              class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400
                     text-zinc-900 pl-10 pr-10 py-3 outline-none focus:bg-white focus:border-rose-300" />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-2 flex items-center rounded px-2 text-xs text-zinc-600 hover:text-zinc-900"
              :aria-label="showPassword ? 'Hide password' : 'Show password'">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Remember + Forgot -->
        <div class="mt-3 flex items-center justify-between">
          <label class="inline-flex items-center gap-2 text-sm text-zinc-700 select-none">
            <input
              id="remember"
              type="checkbox"
              v-model="form.IsRemindDeviceActive"
              class="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500" />
            <span>Remember this device</span>
          </label>

          <a
            href="#"
            v-float-tip="'We will send you a reset link.'"
            class="text-xs underline text-zinc-600 hover:text-zinc-800">
            Forgot password?
          </a>
        </div>

        <!-- Error -->
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

        <!-- Submit -->
        <button
          :disabled="loading"
          class="mt-6 w-full rounded-full bg-rose-500 hover:bg-rose-600
                 disabled:opacity-60 disabled:cursor-not-allowed
                 text-white font-semibold py-3 text-sm shadow-sm transition">
          <span v-if="!loading">Log in</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3"/>
            </svg>
            Processing…
          </span>
        </button>

        <p class="mt-4 text-center text-[13px] text-zinc-600">
          Don't have an account?
          <a href="/register" class="underline hover:text-zinc-900">Sign up</a>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { UseStore } from "../stores/store";
import { computePosition, offset, flip, shift, autoUpdate } from "@floating-ui/dom";

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
  directives: {
    floatTip: {
      mounted(el, binding) {
        let tooltipEl = null, cleanup = null;
        const show = () => {
          if (tooltipEl) return;
          tooltipEl = document.createElement("div");
          tooltipEl.textContent = binding.value || "";
          tooltipEl.className = "pointer-events-none z-50 rounded-md bg-black text-white text-xs px-2 py-1 shadow-lg";
          document.body.appendChild(tooltipEl);
          cleanup = autoUpdate(el, tooltipEl, () => {
            computePosition(el, tooltipEl, { placement: "top", middleware: [offset(8), flip(), shift({ padding: 8 })] })
              .then(({ x, y }) => Object.assign(tooltipEl.style, { position: "fixed", left: `${x}px`, top: `${y}px` }));
          });
        };
        const hide = () => { if (cleanup) cleanup(); cleanup = null; if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; } };
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("focus", show);
        el.addEventListener("blur", hide);
        el._floatTipDestroy = () => { el.removeEventListener("mouseenter", show); el.removeEventListener("mouseleave", hide); el.removeEventListener("focus", show); el.removeEventListener("blur", hide); hide(); };
      },
      unmounted(el) { if (el._floatTipDestroy) el._floatTipDestroy(); }
    }
  }
};
</script>