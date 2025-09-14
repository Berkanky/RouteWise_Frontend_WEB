import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    AppVersion:'1.0.1',
    Config: {},
    UserData: {},

    LoginData: {
      IsRemindDeviceActive: true
    },
    RegisterData: {},

    StartLocation:{},
    DestinationLocation:{},
    
    calculated_route_detail_active: false,
    calculated_route_detail_overview_details: {},
    ServiceRequestData: {},
    ServiceRequestStarted: false,
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
    paths: ["UserData", "Config"],
  },
});