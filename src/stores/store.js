import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    AppVersion:'1.0.0',
    Config: {},
    UserData: {},

    LoginData: {
      IsRemindDeviceActive: true,
      Verified: false,
      VerifySended: false,
    },
    RegisterData: { VerifySended: false },

    DefaultCenterLocation:{},
    StartLocation:{},
    DestinationLocation:{},

    decoded_overview_polyline_points_array:[], // { index:0, decoded_overview_polyline_points:'', routeId: ''};
    created_router_id:[], //oluşturulmuş her polyline
    created_router_id_count:0,

    Token: "",
    ServerRoot: 'http://localhost:3000', //'http://localhost:3000', //"https://api.routewiseapp.com",
    ServerWSRoot:'wss://api.routewiseapp.com', //'wss://localhost:3000', //"wss://api.routewiseapp.com",
    
    AppStarted: false,

    VerificationPageType: "",

    ServiceRequestData: {},

    GoogleMapsMarkerActiveMarkerDetail:{}, //type:'StartLocation'

    SelectedCalculatedRoutes:[],
    SelectedCalculatedRouteDetail:{},

    ServiceRequestStarted: false,

    Routes:[],

    sharedRoutes:[],
    isSharedRoutesEmpty: false,

    tollPassList:[],
  }),
  actions: {
    WatchServices() {
      axios.interceptors.request.use(
        (config) => {
          this.ServiceRequestStarted = true;
          return Promise.resolve(config);
        },
        (err) => {
          this.ServiceRequestStarted = false;
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (res) => {
          this.ServiceRequestStarted = false;
          this.ServiceRequestData = {};

          var message = res.data.message;
          var status = res.status;
          var data = res.data;
          
          Object.assign(this.ServiceRequestData, {message, status, data, config: { url: res.config.url }});

          if(res.config.url == '/auth/details' && res.status === 200) {

            this.Config = res.data.config;
            this.UserData = res.data.UserData; 
          }

          return Promise.resolve(res);
        },
        (err) => {
          this.ServiceRequestStarted = false;
          this.ServiceRequestData = {};

          var message = err.response?.data?.message ?? err.message ?? "Error, please try again.";
          var status = err.response?.status ?? 500;
          
          Object.assign(this.ServiceRequestData, { message, status });

          return Promise.reject(err);
        }
      );
    },
    ResetPiniaStore() {
      this.$reset();
    },
    PasswordRegex(Password) {
      var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return pattern.test(Password);
    },
    EMailAddressRegex(EMailAddress) {
      var EMailAddressRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //RFC5322
      return EMailAddressRegex.test(EMailAddress);
    },
    PhoneNumberRegex(DialCode, PhoneNumber) {
      var CustomerPhoneNumber = DialCode + PhoneNumber;

      var phoneNumberRegex =
        /^(?=(\D*\d){7,15}$)\+?[\s().-]*\d+([\s().-]*\d+)*[\s().-]*$/;
      return phoneNumberRegex.test(CustomerPhoneNumber);
    },
    GetCurrentDateFormatted(){
      var date = new Date();

      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();

      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;

      return month + '.' + day + '.' + year;
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ["UserData", "RegisterData", "Config"],
  },
});