import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    AppVersion:'1.0.3',
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
    GetCurrentDateFormatted(date){
      date = String(date);
      var d = new Date(date);

      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();

      var hour = d.getHours();
      var minute = d.getMinutes();
      var second = d.getSeconds();

      if( month < 10 ) month = '0' + month;
      if( day < 10 ) day = '0' + day;

      if( hour < 10 ) hour = '0' + hour;
      if( minute < 10 ) minute = '0' + minute;
      if( second < 10 ) second = '0' + second;

      var formatted_date = month + '.' + day + '.' + year + ' ' + hour + ':' + minute + ':' + second;

      return formatted_date;
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ["UserData", "Config"],
  },
});