<template>
  <section class="mx-auto w-full max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

      <div>
        <h1 class="text-2xl md:text-[26px] font-semibold text-zinc-900 mb-6">
          Create your account
        </h1>

        <div class="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 md:p-6">
          <form @submit.prevent="onSubmit" novalidate>

            <label class="block text-sm font-medium text-zinc-800 mb-1">Username</label>
            <input v-on:keyup="WatchUserName()" v-model.trim="form.UserName" type="text" autocomplete="username"
              placeholder="Choose a username"
              class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400 text-zinc-900 px-4 py-3 outline-none focus:bg-white focus:border-rose-300"
              :aria-invalid="IsUserNameUsed ? 'true' : 'false'"
              :aria-describedby="IsUserNameUsed ? 'username-error' : null" :class="[
                'w-full rounded-lg px-4 py-3 outline-none placeholder:text-zinc-400 text-zinc-900 focus:bg-white',
                IsUserNameUsed
                  ? 'border border-red-500/70 bg-red-50 focus:border-red-500'
                  : 'border border-rose-200/60 bg-rose-100/40 focus:border-rose-300',
              ]" />
            <p v-if="IsUserNameUsed" id="username-error" class="mt-1 text-sm text-red-600">
              This username is already taken.
            </p>

            <div class="mt-5">
              <label class="block text-sm font-medium text-zinc-800 mb-1">Password</label>
              <input v-model="form.Password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password"
                placeholder="Create a password"
                class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400 text-zinc-900 px-4 py-3 outline-none focus:bg-white focus:border-rose-300" />
            </div>

            <div class="mt-5">
              <label class="block text-sm font-medium text-zinc-800 mb-1">Confirm password</label>
              <input v-model="form.PasswordConfirm" :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password" placeholder="Repeat your password"
                class="w-full rounded-lg border border-rose-200/60 bg-rose-100/40 placeholder:text-zinc-400 text-zinc-900 px-4 py-3 outline-none focus:bg-white focus:border-rose-300" />
            </div>

            <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

            <button :disabled="loading || IsUserNameUsed"
              class="mt-6 w-full rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm shadow-sm transition">
              <span v-if="!loading">Register</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
                </svg>
                Processing…
              </span>
            </button>

            <p class="mt-4 text-center text-[13px] text-zinc-600">
              Already have an account?
              <RouterLink to="/login" class="underline hover:text-zinc-900">Log in</RouterLink>
            </p>
          </form>
        </div>
      </div>

      <div class="order-first lg:order-none">
        <img src="../images/RouteWiseMapV2.jpg" alt="Register illustration"
          class="w-full h-auto rounded-lg border border-zinc-200 shadow-sm object-cover" />
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { UseStore } from "../stores/store";
export default {
  name: "RegisterPage",
  setup() {
    const store = UseStore();
    return {
      store,
    };
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
    };
  },
  mounted() {
    this.WSConnect();
  },
  beforeUnmount() {
    this.cleanupWS(true);
  },
  methods: {
    WatchUserName() {
      var UserName = this.form.UserName?.trim();
      if (!UserName) {
        this.IsUserNameUsed = false;
        return;
      }
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.sendWS({ UserName: UserName });
      }, 300);
    },
    WSConnect() {
      var UserName = this.form.UserName;
      var RailwayWS = this.store.ServerWSRoot;

      try {
        this.socket = new WebSocket(RailwayWS);
      } catch (e) {
        console.error("Web Socket Error. ", e);
        return this.scheduleReconnect();
      }

      this.socket.onopen = () => {
        console.log("Web Socket On Open. ");
        this.reconnectAttempts = 0;
        this.flushQueue();
        this.startHeartbeat();
        if (UserName) this.sendWS({ UserName: UserName });
      };

      this.socket.onmessage = (event) => {
        var IsUserNameUsed = false;
        try {
          IsUserNameUsed = JSON.parse(event.data).payload.IsUserNameUsed;
          this.IsUserNameUsed = IsUserNameUsed;
        } catch {
          return;
        }
      };

      this.socket.onerror = (err) => {
        console.warn("Web Socket Error. ", err?.message || err);
      };

      this.socket.onclose = (evt) => {
        console.log("Web Socket On Close. ", evt.code, evt.reason);
        this.stopHeartbeat();
        if (!this.isManualClose) this.scheduleReconnect();
      };
    },
    sendWS(payload) {
      var data = JSON.stringify(payload);
      if (this.socket && this.socket.readyState === WebSocket.OPEN)
        this.socket.send(data);
      else this.sendQueue.push(data);
    },
    flushQueue() {
      while (
        this.sendQueue.length &&
        this.socket?.readyState === WebSocket.OPEN
      ) {
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
        } catch { }
      }
      this.socket = null;
    },
    async TOTPSetupStartService() {
      try {
        var res = await axios.post("/TOTP/setup/start");
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
      // basic checks
      if (
        !this.form.UserName ||
        !this.form.Password ||
        !this.form.PasswordConfirm
      ) {
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
        var res = await axios.post("/TOTP/setup/login", {
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
