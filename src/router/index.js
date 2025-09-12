import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

var HomePage = () => import("../views/HomePage.vue");
var LoginPage = () => import("../views/LoginPage.vue");
var LoginTOTPVerify = () => import("../views/LoginTOTPVerifyPage.vue");
var RegisterTOTPVerify = () => import("../views/RegisterTOTPVerifyPage.vue");
var Register = () => import("../views/RegisterPage.vue");
var PasswordResetStart = () => import("../views/PasswordResetStartPage.vue");
var PasswordResetVerify= () => import("../views/PasswordResetVerifyPage.vue");
var PasswordReset = () => import("../views/PasswordResetPage.vue");
var StartCalculateRoute = () => import("../views/StartCalculateRoutePage.vue");
var GoogleMaps = () => import("../views/GoogleMaps.vue");
var CalculatedRouteDetail = () => import("../views/CalculatedRouteDetail.vue");

var NotFound = { template: '<div class="p-6">404 – Sayfa bulunamadı</div>' };

var routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: "/login/TOTP/verify",
    name: "LoginTOTPVerify",
    component: LoginTOTPVerify,
    meta: { guestOnly: true },
  },
  {
    path: "/register/TOTP/verify",
    name: "RegisterTOTPVerify",
    component: RegisterTOTPVerify,
    meta: { guestOnly: true },
  },
  {
    path: "/password/reset/start",
    name: "PasswordResetStart",
    component: PasswordResetStart,
    meta: { guestOnly: true },
  },
  {
    path: "/password/reset/verify",
    name: "PasswordResetVerify",
    component: PasswordResetVerify,
    meta: { guestOnly: true },
  },
  {
    path: "/password/reset/complete",
    name: "PasswordReset",
    component: PasswordReset,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/start/calculate/route",
    name: "StartCalculateRoute",
    component: StartCalculateRoute,
    meta: { requiresAuth: true },
  },
  {
    path: "/map",
    name: "GoogleMaps",
    component: GoogleMaps,
    meta: { requiresAuth: true },
  },
  {
    path: "/calculated/route/detail/:_id/:ProcessId",
    name: "CalculatedRouteDetail",
    component: CalculatedRouteDetail,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

var router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved || { top: 0 };
  },
});

var currentUser = null;
var validatedAt = 0;

async function validateSession({ force = true } = {}) {

  if (!force && currentUser && Date.now() - validatedAt < 60_000) return true;
  try {
    var { data } = await axios.get("/auth/details");
    console.log("/auth/details : ", data);
    currentUser = data?.user ?? data;
    validatedAt = Date.now();
    return true;
  } catch {
    currentUser = null;
    validatedAt = 0;
    return false;
  }
}

var SKIP_VALIDATE = new Set(['Login', 'Register', 'LoginTOTPVerify', 'RegisterTOTPVerify']);

router.beforeEach(async (to) => {
  if (SKIP_VALIDATE.has(to.name)) return true;

  var needsAuth = to.matched.some(r => r.meta.requiresAuth);
  if (needsAuth) {
    var authed = await validateSession({ force: false }); // force=false => 60sn cache
    if (!authed) return { name: 'Login', query: { redirect: to.fullPath } };
  }

  return true;
});


export default router;