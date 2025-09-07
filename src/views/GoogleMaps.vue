<template>
    <div id="gmap" class="w-full h-screen" ></div>
</template>

<script>
import { UseStore } from '../stores/store';
import { loadGoogleMapsSdk } from '../utils/maps';
export default {
    name: "GoogleMaps",
    setup(){
        const store = UseStore();
        return{
            store
        }
    },
    async mounted() {
        var GOOGLE_API_KEY = this.store.Config.GOOGLE_API_KEY;
        console.log("GOOGLE_API_KEY : ", GOOGLE_API_KEY);
        await loadGoogleMapsSdk(GOOGLE_API_KEY);

        var el = document.getElementById("gmap");
        var center = { lat: 41.015137, lng: 28.97953 };

        const map = new google.maps.Map(el, {
            center,
            zoom: 10,
            streetViewControl: false,
            mapTypeControl: false,
        });

        new google.maps.Marker({
            position: center,
            map,
            title: "İstanbul",
        });
    },
    watch:{
        'store.UserData':{
            handler(newVal){
                console.log("store.UserData : ", JSON.stringify(newVal));
            },
            immediate: true, deep: true
        },
        'store.Config':{
            handler(newVal){
                console.log("store.config : ", JSON.stringify(newVal));
            },
            immediate: true, deep: true
        }
    }
};
</script>

<style scoped></style>
