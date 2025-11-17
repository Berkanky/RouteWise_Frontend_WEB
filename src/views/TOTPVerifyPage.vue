<template>
  <section class="relative mx-auto w-full max-w-6xl 
         px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-12">
    <!-- Mobil: plain; Desktop: card -->
    <div class="w-full max-w-5xl
             grid grid-cols-1 lg:grid-cols-2 gap-10 items-start
             lg:bg-white lg:rounded-3xl lg:ring-1 lg:ring-zinc-200
             lg:shadow-[0_18px_55px_rgba(15,23,42,0.08)]
             lg:px-10 lg:py-8">
      <!-- Sol: QR & manual key -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
          Set up two-factor authentication
        </h1>
        <p class="mt-2 text-sm text-zinc-600">
          Scan the QR code with your authenticator app or enter the manual key.
        </p>

        <!-- Mobilde kart hissi yok, desktop'ta hafif kart -->
        <div class="mt-6
                 bg-transparent border-0 shadow-none p-0
                 lg:bg-white lg:border lg:border-zinc-200 lg:shadow-sm lg:rounded-2xl lg:p-6">
          <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div class="self-center md:self-start">
              <img :src="qrDataUrl || placeholderQR" alt="TOTP QR Code" class="w-36 h-36 md:w-40 md:h-40 rounded-lg border border-zinc-200
                       bg-white object-contain" />
            </div>

            <div class="grow min-w-0">
              <label class="block text-sm font-medium text-zinc-800">
                Manual key
              </label>

              <div class="mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                <input :value="manualSecret" readonly class="w-full flex-1 min-w-0 truncate rounded-lg
                         border border-zinc-200 bg-zinc-50
                         px-3 py-2 text-zinc-900 font-mono text-sm" />
                <button type="button" @click="copySecret" v-float-tip="'Copy manual key'" class="shrink-0 w-full sm:w-auto rounded-md border border-zinc-200
                         bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50
                         transition">
                  Copy
                </button>
              </div>

              <p class="mt-3 text-xs text-zinc-600 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 font-medium">
                  App: Microsoft Authenticator
                </span>
                <span>or any TOTP-compatible app</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sağ: OTP -->
      <div class="relative">
        <!-- Go to login butonu (sağ üst) -->


        <h2 class="text-xl lg:text-2xl font-semibold text-zinc-900">
          Enter the 6-digit code
        </h2>
        <p class="mt-2 text-sm text-zinc-600">
          Open the app and type the current code.
        </p>

        <!-- Username -->
        <div class="mt-5">
          <label class="block text-sm font-medium text-zinc-800">
            Username
          </label>
          <input :value="username" disabled aria-readonly="true" class="mt-1 w-full lg:w-[360px] rounded-lg
                   border border-zinc-200 bg-zinc-50
                   px-3 py-2 text-zinc-900 text-sm cursor-not-allowed" />
          <p class="mt-1 text-[12px] text-zinc-500">
            This account will be protected with 2FA.
          </p>
        </div>

        <!-- OTP inputs -->
        <div class="mt-6 flex justify-center lg:justify-start gap-2 md:gap-3" @paste.prevent="onPaste">
          <input v-for="(v, i) in code" :key="i" ref="box" inputmode="numeric" autocomplete="one-time-code"
            pattern="[0-9]*" maxlength="1" :value="v" @input="onInput(i, $event)" @keydown="onKeydown(i, $event)" class="h-12 w-10 md:h-12 md:w-12 text-center text-lg md:text-xl font-medium
                   rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900
                   outline-none transition
                   focus:bg-white focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300" />
        </div>

        <p v-if="error" class="mt-4 text-sm text-red-600">
          {{ error }}
        </p>

        <!-- Submit -->
        <button :disabled="loading || otpString.length !== 6 || TOTPVerifyBoardingStatus" @click="onVerify" class="mt-6 w-full lg:w-[360px] rounded-full
                 bg-gradient-to-r from-zinc-900 to-black
                 text-white font-semibold py-3 text-sm shadow-sm
                 hover:opacity-95 active:opacity-90
                 disabled:opacity-60 disabled:cursor-not-allowed
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-zinc-900/25 transition">
          <span v-if="!loading">Verify &amp; Complete</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" />
            </svg>
            Verifying…
          </span>
        </button>
        <button type="button" @click="$router.push('/login')" class="mt-3 w-full lg:w-[360px] rounded-full bg-zinc-100 hover:bg-zinc-200
         text-zinc-800 font-medium py-3 text-sm transition">
          Go to login
        </button>
      </div>
    </div>

    <!-- Backup codes modal aynı kaldı, istersen sonra onu da nötralize ederiz -->
    <div v-if="showCodesModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" aria-hidden="true"></div>

      <div class="relative w-full max-w-lg rounded-3xl bg-white shadow-xl
               border border-zinc-200 p-6 sm:p-8 mx-4">
        <h3 class="text-lg font-semibold text-zinc-900">
          Save your backup codes
        </h3>
        <p class="mt-1 text-sm text-zinc-600">
          You will only see these codes <b>once</b>. Store them securely.
        </p>

        <div class="mt-4 rounded-lg border border-zinc-200 bg-zinc-50
                 p-3 max-h-56 overflow-auto">
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm text-zinc-800">
            <li v-for="(c, i) in backupCodes" :key="c">
              <span class="text-zinc-500 mr-2">
                {{ String(i + 1).padStart(2, '0') }}.
              </span>
              {{ c }}
            </li>
          </ul>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <button @click="downloadCodes" class="rounded-md border border-zinc-200 bg-white px-3 py-2
                   text-sm text-zinc-800 hover:bg-zinc-50 transition">
            Download .txt
          </button>
          <button @click="copyCodes" class="rounded-md border border-zinc-200 bg-white px-3 py-2
                   text-sm text-zinc-800 hover:bg-zinc-50 transition">
            Copy all
          </button>
          <button @click="continueToLogin" class="ml-auto rounded-full bg-zinc-900 hover:bg-black
                   text-white px-4 py-2 text-sm font-semibold transition">
            I saved them → Continue
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/dom";
import { UseStore } from "../stores/store";

export default {
  name: "TOTPVerify",
  setup() {
    var store = UseStore();
    return {
      store,
    };
  },
  data() {
    return {
      TOTPVerifyBoardingStatus: false,
      backupCodes: [],
      showCodesModal: false,
      qrDataUrl: "",
      manualSecret: "",
      code: ["", "", "", "", "", ""],
      loading: false,
      error: "",
      username: "", // ADDED
      placeholderQR:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="100%" height="100%" fill="#f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#71717a">QR Loading…</text></svg>'
        ),
    };
  },
  computed: {
    otpString() {
      return this.code.join("");
    },
  },
  async mounted() {

    var { QRDataUrl, ManualSecret, UserName } = this.store.TOTPSetupData;

    this.qrDataUrl = QRDataUrl;
    this.manualSecret = ManualSecret;
    this.username = UserName;
  },
  beforeRouteLeave(to, from) {
    this.store.TOTPSetupData = {};
  },
  methods: {
    downloadCodes() {

      if (!this.backupCodes?.length) return;

      var now = new Date().toISOString().replace(/[:.]/g, "-");
      var fileName = `backup-codes-${this.username || 'user'}-${now}.txt`;
      var header = `These are your one-time backup codes.\nStore them securely. Each can be used once.\n\nUsername: ${this.username}\nGenerated: ${new Date().toISOString()}\n\n`;
      var body = this.backupCodes
        .map((c, i) => `${String(i + 1).padStart(2, '0')}. ${c}`)
        .join('\n');
      var blob = new Blob([header + body + '\n'], {
        type: 'text/plain;charset=utf-8',
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    },
    copyCodes() {
      if (!this.backupCodes?.length) return;

      var body = this.backupCodes.join('\n');
      navigator.clipboard?.writeText(body);
    },
    continueToLogin() {
      this.showCodesModal = false;
      this.$router.replace({ name: 'Login' });
    },
    async onVerify() {
      this.error = '';

      if (this.otpString.length !== 6) return;

      try {

        this.loading = true;
        var res = await axios.post('/TOTP/setup/verify', {
          Code: this.otpString,
        });

        if (res.status !== 200) return this.error = res.data.message;

        this.showCodesModal = true;
        this.backupCodes = res.data.Plain_Codes;
        this.TOTPVerifyBoardingStatus = true;

      } catch (e) {

        this.error = e?.response?.data?.message || 'Invalid code, please try again.';
        this.code = ['', '', '', '', '', ''];
        var first = this.$refs.box?.[0];
        if (first) first.focus();

      } finally {

        this.loading = false;
      }
    },
    copySecret() {
      if (!this.manualSecret) return;
      navigator.clipboard?.writeText(this.manualSecret);
    },
    onInput(i, e) {
      var val = (e.target.value || '').replace(/\\D/g, '');
      if (!val) {
        this.code[i] = '';
        return;
      }
      this.code[i] = val.slice(-1);
      var next = this.$refs.box?.[i + 1];
      if (next) next.focus();
    },
    onKeydown(i, e) {
      if (e.key === 'Backspace' && !this.code[i]) {
        var prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === 'ArrowLeft') {
        var prev = this.$refs.box?.[i - 1];
        if (prev) prev.focus();
      }
      if (e.key === 'ArrowRight') {
        var next = this.$refs.box?.[i + 1];
        if (next) next.focus();
      }
    },
    onPaste(e) {
      var text = (e.clipboardData?.getData('text') || '')
        .replace(/\\D/g, '')
        .slice(0, 6);
      if (!text) return;
      for (let i = 0; i < 6; i++) this.code[i] = text[i] || '';
      var idx = Math.min(text.length, 5);
      var el = this.$refs.box?.[idx];
      if (el) el.focus();
    },
  },
  directives: {
    floatTip: {
      mounted(el, binding) {
        var tooltipEl = null;
        var cleanup = null;
        var show = () => {
          if (tooltipEl) return;
          tooltipEl = document.createElement('div');
          tooltipEl.textContent = binding.value || '';
          tooltipEl.className =
            'pointer-events-none z-50 rounded-md bg-black text-white text-xs px-2 py-1 shadow-lg';
          document.body.appendChild(tooltipEl);
          cleanup = autoUpdate(el, tooltipEl, () => {
            computePosition(el, tooltipEl, {
              placement: 'top',
              middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
              Object.assign(tooltipEl.style, {
                position: 'fixed',
                left: `${x}px`,
                top: `${y}px`,
              });
            });
          });
        };
        var hide = () => {
          if (cleanup) cleanup();
          cleanup = null;
          if (tooltipEl) {
            tooltipEl.remove();
            tooltipEl = null;
          }
        };
        el.addEventListener('mouseenter', show);
        el.addEventListener('mouseleave', hide);
        el.addEventListener('focus', show);
        el.addEventListener('blur', hide);
        el._floatTipDestroy = () => {
          el.removeEventListener('mouseenter', show);
          el.removeEventListener('mouseleave', hide);
          el.removeEventListener('focus', show);
          el.removeEventListener('blur', hide);
          hide();
        };
      },
      unmounted(el) {
        if (el._floatTipDestroy) el._floatTipDestroy();
      }
    }
  }
};
</script>