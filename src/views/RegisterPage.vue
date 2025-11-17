<template>
  <section
    class="min-h-[88vh] w-full px-4 sm:px-6 py-8 sm:py-10
           flex items-start md:items-center justify-center bg-zinc-50"
  >
    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2
             bg-white
             md:rounded-3xl md:ring-1 md:ring-zinc-200
             md:shadow-[0_18px_55px_rgba(15,23,42,0.08)]
             md:overflow-hidden"
    >
      <!-- Sol: Form -->
      <div class="w-full px-5 sm:px-8 md:px-12 py-10 md:py-14 flex flex-col justify-center">
        <div class="w-full max-w-md mx-auto text-center md:text-left">

          <img
            src="../images/AppIconRouteWise-4 1.svg"
            alt="Routewise Logo"
            class="w-16 h-16 sm:w-20 sm:h-20 mx-auto md:mx-0 mb-6 sm:mb-8"
          />

          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">
            Create your account
          </h1>
          <p class="text-sm text-zinc-500 mb-8">
            Start your journey with RouteWise.
          </p>

          <form @submit.prevent="onSubmit" novalidate class="space-y-4">

            <!-- Username -->
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                id="username"
                v-model.trim="form.UserName"
                @keyup="WatchUserName"
                type="text"
                autocomplete="username"
                placeholder="Choose a username"
                :aria-invalid="is_user_name_existing ? 'true' : 'false'"
                class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                       ring-1 ring-inset ring-zinc-200
                       focus:bg-white focus:ring-2 focus:ring-zinc-900/20
                       outline-none transition"
                :class="is_user_name_existing ? 'bg-red-50 ring-2 ring-red-300' : ''"
              />
              <p v-if="is_user_name_existing" class="text-xs text-red-600 mt-1">
                This username is already taken.
              </p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="sr-only">Password</label>
              <div class="relative">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.Password"
                  autocomplete="new-password"
                  placeholder="Create a password"
                  class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                         ring-1 ring-inset ring-zinc-200
                         focus:bg-white focus:ring-2 focus:ring-zinc-900/20 outline-none transition"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-pressed="showPassword ? 'true' : 'false'"
                  class="absolute inset-y-0 right-4 flex items-center text-xs sm:text-sm text-zinc-600 hover:text-zinc-900"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <p class="mt-1 text-xs text-zinc-500">
                Use at least 8 characters, including letters and numbers.
              </p>
            </div>

            <!-- Password Confirm -->
            <div>
              <label for="password_confirm" class="sr-only">Confirm password</label>
              <div class="relative">
                <input
                  id="password_confirm"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.PasswordConfirm"
                  autocomplete="new-password"
                  placeholder="Re-enter your password"
                  class="w-full rounded-full bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-500
                         ring-1 ring-inset ring-zinc-200
                         focus:bg-white focus:ring-2 focus:ring-zinc-900/20 outline-none transition"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-pressed="showPassword ? 'true' : 'false'"
                  class="absolute inset-y-0 right-4 flex items-center text-xs sm:text-sm text-zinc-600 hover:text-zinc-900"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </p>

            <!-- Submit -->
            <button
              :disabled="loading || is_user_name_existing"
              class="w-full py-3 rounded-full bg-gradient-to-r from-zinc-900 to-black text-white
                     font-semibold shadow-sm hover:opacity-95 active:opacity-90
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/25
                     transition mt-2"
            >
              <span v-if="!loading">Register</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                </svg>
                Processing…
              </span>
            </button>

            <!-- Login link -->
            <p class="pt-4 text-center text-sm text-zinc-600">
              Already have an account?
              <RouterLink
                to="/login"
                class="text-zinc-900 underline underline-offset-2 hover:opacity-80 font-medium"
              >
                Log in
              </RouterLink>
            </p>
          </form>
        </div>
      </div>

      <!-- Sağ: Görsel -->
      <div class="hidden md:block relative">
        <img
          src="../images/background.jpg"
          alt="Register illustration"
          class="w-full h-full object-cover"
        />
        <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/60 to-transparent"></div>
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
      is_user_name_existing: false,
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
      this.$router.push({ name: "TOTPVerify" });
    },
    WatchUserName() {
      var UserName = this.form.UserName?.trim();
      if (!UserName) {
        this.is_user_name_existing = false;
        return;
      }
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.sendWS({ UserName });
      }, 300);
    },
    WSConnect() {
      var web_socket_api_url = import.meta.env.VITE_WEB_SOCKET_API_URL;
      try {

        this.socket = new WebSocket(web_socket_api_url);
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

          var payload = JSON.parse(event.data)?.payload;
          if (typeof payload?.is_user_name_existing === "boolean") this.is_user_name_existing = payload.is_user_name_existing;
        } catch(err){
          console.log(err);
        }
      };

      this.socket.onerror = (err) => console.warn("Web Socket Error. ", err?.message || err);
      this.socket.onclose = () => {
        this.stopHeartbeat();
        if (!this.isManualClose) this.scheduleReconnect();
      };
    },
    sendWS(payload) {

      var data = JSON.stringify(payload);

      if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(data);
      else this.sendQueue.push(data);
    },
    flushQueue() {
      while (this.sendQueue.length && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(this.sendQueue.shift());
      }
    },
    scheduleReconnect() {
      var delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 15000);
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
    async onSubmit() {
      this.error = "";

      if (!this.form.UserName || !this.form.Password || !this.form.PasswordConfirm) {

        this.error = "Please fill in all fields.";
        return;
      }

      if (this.is_user_name_existing) {

        this.error = "Please choose another username.";
        return;
      }
      if (this.form.Password !== this.form.PasswordConfirm) {

        this.error = "Passwords do not match.";
        return;
      }
      try {

        this.loading = true;

        var res = await axios.post("/TOTP/setup/login", {
          UserName: this.form.UserName,
          Password: this.form.Password,
          PasswordConfirm: this.form.PasswordConfirm,
        });

        if( res.status !== 200 ) return this.error = res.data?.message;

        this.store.RegisterData = this.form;

        this.store.TOTPSetupData.QRDataUrl = res.data.QRDataUrl;
        this.store.TOTPSetupData.ManualSecret = res.data.ManualSecret;
        this.store.TOTPSetupData.UserName = this.form.UserName;

        this.$router.push({ name: "TOTPVerify" });

      } catch (e) {

        this.error = e?.response?.data?.message || "Registration failed.";
      } finally {

        this.loading = false;
      }
    },
  },
};
</script>