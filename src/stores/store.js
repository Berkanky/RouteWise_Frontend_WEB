import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    WebAppName: 'RouteWise',
    AppVersion:'1.7.1',
    Config: {},
    UserData: {},
    report_result: {},

    LoginData: {
      IsRemindDeviceActive: true
    },

    RegisterData: {},

    TOTPSetupData:{},

    StartLocation:{},
    DestinationLocation:{},
    
    calculated_route_detail_active: false,
    calculated_route_detail_overview_details: {}
  }),
  actions: {
    WatchServices() {
      axios.interceptors.request.use(
        (config) => {
          return Promise.resolve(config);
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (res) => {
          return Promise.resolve(res);
        },
        (err) => {
          return Promise.reject(err);
        }
      );
    },
    async user_details_service(){
      
      this.UserData = {};
      this.report_result = {};

      var user_data = {};
      var report_result = {};
      
      try{

        var response = await axios.get('/auth/details');
        if( !response.status === 200 ) return;

        user_data = response?.data?.UserData;
        report_result = response?.data?.report_result;

        return;
      }catch(err){
        console.log(err);
        return;
      }finally{
        this.UserData = user_data;
        this.report_result = report_result;
      }
    },
    async client_config_service(){
      var config = {};
      this.Config = '';

      try{
        var response = await axios.get('/client-config');
        if( response.status !== 200 ) return;

        config = response?.data.config;
      }catch(err){
        console.log(err);
        return;

      }finally{
        
        this.Config = config;
      }
    },
    ResetPiniaStore() {
      this.$reset();
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ["UserData"]
  }, 
});