<template>
  <!-- Outer container for register page with centered content and soft backdrop -->
  <section
    class="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-16 pb-12 flex items-center justify-center"
  >
    <!-- Card wrapper using a two-column grid -->
    <div
      class="w-full overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-md grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Left: Registration form -->
      <div class="p-6 md:p-10 order-2 lg:order-1">
        <header class="mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-zinc-900">
            Create your account
          </h1>
          <p class="mt-1 text-sm text-zinc-500">
            Start your journey with RouteWise
          </p>
        </header>
        <form @submit.prevent="onSubmit" novalidate>
          <!-- Username field with real-time uniqueness check -->
          <label
            class="block text-sm font-medium text-zinc-800 mb-1"
            for="register-username"
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
              id="register-username"
              v-on:keyup="WatchUserName()"
              v-model.trim="form.UserName"
              type="text"
              autocomplete="username"
              placeholder="Choose a username"
              :aria-invalid="IsUserNameUsed ? 'true' : 'false'"
              :aria-describedby="IsUserNameUsed ? 'username-error' : null"
              :class="[
                'w-full rounded-lg pl-10 pr-3 py-3 outline-none placeholder:text-zinc-400 text-zinc-900 focus:bg-white',
                IsUserNameUsed
                  ? 'border border-red-500/70 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border border-rose-200/60 bg-rose-50/40 focus:border-rose-400 focus:ring-2 focus:ring-rose-300',
              ]"
            />
          </div>
          <p
            v-if="IsUserNameUsed"
            id="username-error"
            class="mt-1 text-sm text-red-600"
          >
            This username is already taken.
          </p>

          <!-- Password field -->
          <div class="mt-6">
            <label
              class="block text-sm font-medium text-zinc-800 mb-1"
              for="register-password"
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
                id="register-password"
                v-model="form.Password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Create a password"
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
            <p class="mt-1 text-xs text-zinc-500">
              Use at least 8 characters, including a number.
            </p>
          </div>

          <!-- Confirm password field -->
          <div class="mt-6">
            <label
              class="block text-sm font-medium text-zinc-800 mb-1"
              for="register-confirm"
            >
              Confirm password
            </label>
            <div class="relative">
              <span
                class="pointer-events-none absolute inset-y-0 left-3 flex items-center"
              >
                <!-- Lock icon reused -->
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
                id="register-confirm"
                v-model="form.PasswordConfirm"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Re-enter your password"
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

          <!-- Error message -->
          <p v-if="error" class="mt-4 text-sm text-red-600">
            {{ error }}
          </p>

          <!-- Submit button -->
          <button
            :disabled="loading || IsUserNameUsed"
            class="mt-7 w-full rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition"
          >
            <span v-if="!loading">Register</span>
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
            Already have an account?
            <RouterLink
              to="/login"
              class="underline text-rose-600 hover:text-rose-800"
            >
              Log in
            </RouterLink>
          </p>
        </form>
      </div>

      <!-- Right: Illustration inside card -->
      <div
        class="order-1 lg:order-2 bg-rose-50 border-b lg:border-b-0 lg:border-l border-rose-200 hidden lg:block"
      >
        <div class="h-56 lg:h-full">
          <img
            src="../images/RouteWiseMapV2.jpg"
            alt="Register illustration"
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";

export default {
  name: "RegisterPage",
  components: { Dialog, DialogPanel, DialogTitle, TransitionRoot },
  setup() {
    const store = UseStore();
    return { store };
  },
  data() {
    return {
      form: { UserName: "", Password: "", PasswordConfirm: "" },
      showPassword: false,
      loading: false,
      error: "",
      socket: null,
      isManualClose: false,
      reconnectAttempts: 0,
      reconnectTimer: null,
      heartbeatTimer: null,
      sendQueue: [],
      debounceTimer: null,
      IsUserNameUsed: false,
      showResume: false,
      resumeTimer: null,
    };
  },
  async mounted() {
    this.WSConnect();
    await this.RegisterTOTPSetupStatusService();
  },
  beforeUnmount() {
    this.cleanupWS(true);
    clearTimeout(this.resumeTimer);
  },
  methods: {
    async RegisterTOTPSetupStatusService() {
      try {
        const res = await axios.get(`/TOTP/setup/status`);
        if (res.status === 200) {
          this.store.RegisterData.QRDataUrl = res.data.QRDataUrl;
          this.store.RegisterData.ManualSecret = res.data.ManualSecret;
          this.store.RegisterData.UserName = res.data.UserName;
          // show info modal, then auto-redirect
          this.showResume = true;
          this.resumeTimer = setTimeout(() => {
            this.$router.push({ name: "RegisterTOTPVerify" });
          }, 5000);
        }
      } catch (e) {
        // no ongoing setup = 404/204 vs. ignore
      }
    },
    goVerifyNow() {
      clearTimeout(this.resumeTimer);
      this.$router.push({ name: "RegisterTOTPVerify" });
    },
    WatchUserName() {
      const UserName = this.form.UserName?.trim();
      if (!UserName) {
        this.IsUserNameUsed = false;
        return;
      }
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.sendWS({ UserName });
      }, 300);
    },
    WSConnect() {
      var RailwayWS = import.meta.env.VITE_WEB_SOCKET_API_URL;
      try {
        this.socket = new WebSocket(RailwayWS);
      } catch (e) {
        console.error("Web Socket Error. ", e);
        return this.scheduleReconnect();
      }
      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.flushQueue();
        this.startHeartbeat();
        if (this.form.UserName) this.sendWS({ UserName: this.form.UserName });
      };
      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)?.payload;
          if (typeof payload?.IsUserNameUsed === "boolean") {
            this.IsUserNameUsed = payload.IsUserNameUsed;
          }
        } catch {}
      };
      this.socket.onerror = (err) => console.warn("Web Socket Error. ", err?.message || err);
      this.socket.onclose = () => {
        this.stopHeartbeat();
        if (!this.isManualClose) this.scheduleReconnect();
      };
    },
    sendWS(payload) {
      const data = JSON.stringify(payload);
      if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(data);
      else this.sendQueue.push(data);
    },
    flushQueue() {
      while (this.sendQueue.length && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(this.sendQueue.shift());
      }
    },
    scheduleReconnect() {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 15000);
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => this.WSConnect(), delay);
    },
    startHeartbeat() {
      this.stopHeartbeat();
      this.heartbeatTimer = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN)
          this.socket.send(JSON.stringify({ type: "ping", t: Date.now() }));
      }, 25_000);
    },
    stopHeartbeat() {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    },
    cleanupWS(manual = false) {
      this.isManualClose = manual;
      clearTimeout(this.reconnectTimer);
      this.stopHeartbeat();
      if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
        try {
          this.socket.close(1000, "client closing");
        } catch {}
      }
      this.socket = null;
    },
    async TOTPSetupStartService() {
      try {
        const res = await axios.post("/TOTP/setup/start");
        if (res.status === 200) {
          this.store.RegisterData.QRDataUrl = res.data.QRDataUrl;
          this.store.RegisterData.ManualSecret = res.data.ManualSecret;
          this.$router.push({ name: "RegisterTOTPVerify" });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async onSubmit() {
      this.error = "";
      if (!this.form.UserName || !this.form.Password || !this.form.PasswordConfirm) {
        this.error = "Please fill in all fields.";
        return;
      }
      if (this.IsUserNameUsed) {
        this.error = "Please choose another username.";
        return;
      }
      if (this.form.Password !== this.form.PasswordConfirm) {
        this.error = "Passwords do not match.";
        return;
      }
      try {
        this.loading = true;
        const res = await axios.post("/TOTP/setup/login", {
          UserName: this.form.UserName,
          Password: this.form.Password,
          PasswordConfirm: this.form.PasswordConfirm,
        });
        if (res.status === 200) {
          this.store.RegisterData = this.form;
          this.TOTPSetupStartService();
        }
      } catch (e) {
        this.error = e?.response?.data?.message || "Registration failed.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>