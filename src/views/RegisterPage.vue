<template>
  <section class="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 pb-8 flex items-start justify-center min-h-[80vh]">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 md:bg-white md:rounded-xl md:border md:border-zinc-200 md:shadow-sm md:overflow-hidden">
      
      <!-- Left: Register Form -->
      <div class="w-full px-4 py-10 sm:px-6 md:px-12 md:py-16 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">
          <!-- Logo -->
          <img src="../images/AppIconRouteWise-4 1.svg" alt="Routewise Logo" class="w-24 h-24 mx-auto md:mx-0 mb-8" />
          
          <!-- Heading -->
          <h1 class="text-2xl font-bold text-black mb-2">Create your account</h1>
          <p class="text-sm text-zinc-500 mb-8">Start your journey with RouteWise.</p>

          <!-- Form -->
          <form @submit.prevent="onSubmit" novalidate class="text-left">

            <!-- Username -->
            <div class="mb-4">
              <input
                v-model.trim="form.UserName"
                @keyup="WatchUserName"
                type="text"
                autocomplete="username"
                placeholder="Choose a username"
                :aria-invalid="IsUserNameUsed ? 'true' : 'false'"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
                :class="IsUserNameUsed ? 'border border-red-500 bg-red-50' : ''"
              />
              <p v-if="IsUserNameUsed" class="text-sm text-red-600 mt-1">This username is already taken.</p>
            </div>

            <!-- Password -->
            <div class="mb-4 relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.Password"
                autocomplete="new-password"
                placeholder="Create a password"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-4 flex items-center text-sm text-zinc-600 hover:text-black">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4 relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.PasswordConfirm"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-black placeholder:text-zinc-500 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-4 flex items-center text-sm text-zinc-600 hover:text-black">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-sm text-red-600 text-center mt-3">
              {{ error }}
            </p>

            <!-- Register Button -->
            <button
              :disabled="loading || IsUserNameUsed"
              class="w-full py-3 rounded-full bg-gradient-to-r from-zinc-900 to-black text-white font-semibold shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-4">
              <span v-if="!loading">Register</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                </svg>
                Processing…
              </span>
            </button>

            <!-- Already have account -->
            <p class="mt-6 text-center text-sm text-zinc-600">
              Already have an account?
              <RouterLink to="/login" class="text-black underline hover:text-zinc-800 font-medium">
                Log in
              </RouterLink>
            </p>
          </form>
        </div>
      </div>

      <!-- Right: Illustration -->
      <div class="hidden md:block bg-zinc-100">
        <img src="../images/background.jpg" alt="Register illustration" class="w-full h-full object-cover" />
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
  },
  beforeUnmount() {
    this.cleanupWS(true);
    clearTimeout(this.resumeTimer);
  },
  methods: {
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