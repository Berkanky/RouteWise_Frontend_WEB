<template>
    <div id="gmap" class="w-full h-screen"></div>
</template>

<script>
export default {
    name: "GoogleMaps",

    mounted() {
        const el = document.getElementById("gmap");
        const center = { lat: 41.015137, lng: 28.97953 }; // İstanbul

        // index.html'deki Google Maps script'inden global google nesnesi hazır
        const map = new google.maps.Map(el, {
            center,
            zoom: 10,
            streetViewControl: false,
            mapTypeControl: false,
        });

        // Minimal marker
        new google.maps.Marker({
            position: center,
            map,
            title: "İstanbul",
        });
    },
};
</script>

<style scoped></style>
