<template>
  <section class="mx-auto w-full max-w-xl">
    <h1
      class="text-center text-2xl md:text-[26px] font-semibold text-zinc-900 mb-6"
    >
      Welcome back
    </h1>

    <div
      class="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 md:p-6"
    >
      <form @submit.prevent="onSubmit" novalidate>
        <label class="block text-sm font-medium text-zinc-800 mb-1"
          >Username</label
        >
        <input
          v-model.trim="form.UserName"
          type="text"
          autocomplete="username"
          placeholder="Enter your username"
          class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400 text-zinc-900 px-4 py-3 outline-none focus:bg-white focus:border-rose-300"
        />

        <div class="mt-5">
          <label class="block text-sm font-medium text-zinc-800 mb-1"
            >Password</label
          >
          <input
            v-model="form.Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Enter your password"
            class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400 text-zinc-900 px-4 py-3 outline-none focus:bg-white focus:border-rose-300"
          />
        </div>

        <!-- Remember + Forgot -->
        <div class="mt-3 flex items-center justify-between">
          <label
            class="inline-flex items-center gap-2 text-sm text-zinc-700 select-none"
          >
            <input
              id="remember"
              type="checkbox"
              v-model="form.IsRemindDeviceActive"
              class="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
            />
            <span>Remember this device</span>
          </label>

          <a
            href="#"
            v-float-tip="'We will send you a reset link.'"
            class="text-xs underline text-zinc-600 hover:text-zinc-800"
          >
            Forgot password?
          </a>
        </div>

        <!-- Error -->
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

        <!-- Submit -->
        <button
          :disabled="loading"
          class="mt-6 w-full rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
        >
          <span v-if="!loading">Log in</span>
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
import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/dom";

export default {
  name: "LoginPage",
  setup(){
    const store = UseStore();
    return{
      store
    }
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
        var res = await axios.post(
          "/login",
          {
            UserName: this.form.UserName,
            Password: this.form.Password,
          }
        );
        console.log(res);
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
    // v-float-tip="'text'"
    floatTip: {
      mounted(el, binding) {
        var tooltipEl = null;
        var cleanup = null;
        const show = () => {
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
        const hide = () => {
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
