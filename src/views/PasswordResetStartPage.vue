<template>
  <!-- Dış bölüm: ortalanmış, yumuşak arka plan -->
  <section
    class="mx-auto w-full max-w-md sm:max-w-lg px-4 sm:px-6 pt-16 pb-12 flex items-center justify-center"
  >
    <!-- Kart: yuvarlak köşeler, kırmızı kenarlık ve gölge -->
    <div
      class="w-full rounded-3xl border border-rose-200 bg-white shadow-md p-6 sm:p-10"
    >
      <header class="mb-6 sm:mb-8">
        <h1 class="text-center text-2xl md:text-3xl font-bold text-zinc-900">
          Reset your password
        </h1>
        <p class="mt-2 text-center text-sm text-zinc-600">
          Enter your username to start the reset flow.
        </p>
      </header>
      <form @submit.prevent="onSubmit" novalidate>
        <!-- Username -->
        <label
          for="username"
          class="block text-sm font-medium text-zinc-800 mb-1"
        >
          Username
        </label>
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center"
          >
            <!-- user icon -->
            <svg
              class="h-4 w-4 text-rose-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
              />
            </svg>
          </span>
          <input
            id="username"
            v-model.trim="form.UserName"
            type="text"
            inputmode="text"
            autocomplete="username"
            placeholder="Enter your username"
            class="w-full rounded-lg border border-rose-200/60 bg-rose-50/40 placeholder:text-zinc-400 text-zinc-900 pl-10 pr-3 py-3 outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition"
            :aria-invalid="!!error || undefined"
          />
        </div>

        <!-- Yardımcı bilgi -->
        <p class="mt-2 text-[13px] text-zinc-600">
          We’ll continue if an account exists for this username.
        </p>

        <!-- Hata mesajı -->
        <p v-if="error" class="mt-4 text-sm text-red-600">
          {{ error }}
        </p>

        <!-- Gönder butonu -->
        <button
          type="submit"
          :disabled="loading || !form.UserName"
          class="mt-6 w-full rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
        >
          <span v-if="!loading">Continue</span>
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
            Processing…
          </span>
        </button>

        <!-- Girişe geri dön -->
        <p class="mt-4 text-center text-[13px] text-zinc-600">
          Remembered your password?
          <a
            href="/login"
            class="underline text-rose-600 hover:text-rose-800"
            v-float-tip="'Go back to sign in.'"
            >Sign in</a
          >
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { computePosition, offset, flip, shift, autoUpdate } from "@floating-ui/dom";

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
      if (!this.form.UserName) {
        this.error = "Please enter your username.";
        return;
      }
      try {
        this.loading = true;
        const res = await axios.post("/password/reset/start", {
          UserName: this.form.UserName,
        });
        if (res.status === 200) this.$router.push({ name: "PasswordResetVerify" });
        else this.error = res.data.message;
      } catch (e) {
        // herhangi bir durumda genel mesaj
        this.error = "We’ll continue if an account exists for this username.";
      } finally {
        this.loading = false;
      }
    },
  },
  directives: {
    floatTip: {
      mounted(el, binding) {
        let tooltipEl = null,
          cleanup = null;
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