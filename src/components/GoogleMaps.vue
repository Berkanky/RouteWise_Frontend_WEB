<template>
  <div class="gmap-wrap">
    <div id="gmap" class="gmap-canvas"></div>
  </div>
</template>

<script>
import { UseStore } from '../stores/store';
import { loadGoogleMapsSdk } from '../utils/maps';
import axios from 'axios';

var BASE_STYLE = { strokeColor: '#2563eb', strokeOpacity: 0.95, strokeWeight: 4, zIndex: 10 };
var HOVER_STYLE = { strokeWeight: 6, zIndex: 20 };
var SELECTED_STYLE = { strokeColor: '#ef4444', strokeWeight: 7, zIndex: 30 };

function makeHitArea(path) {
  return new google.maps.Polyline({
    path,
    strokeOpacity: 0,
    strokeWeight: 14,
    clickable: true,
    zIndex: 5
  });
}

export default {
  setup() {
    var store = UseStore();
    return { store };
  },
  props: ["build_route_button_triggered"],
  data() {
    return {
      StartLocation: {},
      DestinationLocation: {},
      map: null,
      center: {},
      markersByKey: {},
      infoWindow: null,
      polylines: [],
      isBuilding: false,
      buildToken: 0,
      selectedPolyline: null,
      selected_polyline_temporary_id: null,
      decoded_overview_polyline_points: []
    };
  },
  computed: {
    isRouteReady() {
      var s = this.StartLocation, d = this.DestinationLocation;
      var ok = v => v && typeof v.latitude === 'number' && typeof v.longitude === 'number';
      return ok(s) && ok(d);
    }
  },
  async mounted() {

    var GOOGLE_API_KEY = this.store.Config.GOOGLE_API_KEY;
    if (!GOOGLE_API_KEY) return;

    var default_center = { lat: 41.015137, lng: 28.97953 };

    await loadGoogleMapsSdk(GOOGLE_API_KEY);

    var el = document.getElementById("gmap");
    var start = this.StartLocation || {};
    var center = {};

    if (typeof start.latitude === "number" && typeof start.longitude === "number") center = { lat: start.latitude, lng: start.longitude };
    if (Object.keys(center).length !== 2) center = default_center;

    var map = new google.maps.Map(el, {
      center,
      zoom: 10,
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: 'cooperative',
      scrollwheel: false
    });

    this.map = map;
    this.center = center;
    this.infoWindow = new google.maps.InfoWindow();

    this.map.addListener('click', () => {
      this.clearSelection();
      this.infoWindow?.close();
    });
  },
  methods: {
    focusOn(pos, opts = {}) {

      if (!this.map || !pos) return;
      var { zoomIfCloser = 14 } = opts;

      try { this.map.panTo(pos); } catch (_) { this.map.setCenter(pos); }

      var curZoom = typeof this.map.getZoom === 'function' ? (this.map.getZoom() ?? 10) : 10;
      if (curZoom < zoomIfCloser) setTimeout(() => { try { this.map.setZoom(zoomIfCloser); } catch { } }, 120);
    },
    hardResetMap() {

      if (!this.map) return;

      try { this.infoWindow?.close(); } catch (_) { }

      if (Array.isArray(this.polylines) && this.polylines.length) {
        for (var pl of this.polylines) {
          try { pl.__hit?.setMap(null); } catch { }
          try { pl.setMap?.(null); } catch { }
        }
      }

      this.polylines = [];
      this.selectedPolyline = null;
      this.selected_polyline_temporary_id = null;

      var center = this.map.getCenter()?.toJSON?.() || this.center || { lat: 41.015137, lng: 28.97953 };
      var zoom = this.map.getZoom?.() ?? 10;

      this.markersByKey = {};

      var el = document.getElementById("gmap");
      if (el) el.innerHTML = "";

      var map = new google.maps.Map(el, {
        center,
        zoom,
        streetViewControl: false,
        mapTypeControl: false
      });

      this.map = map;
      this.infoWindow = new google.maps.InfoWindow();

      this.map.addListener('click', () => {
        this.clearSelection();
        this.infoWindow?.close();
      });

      if (this.StartLocation?.latitude && this.StartLocation?.longitude) this.upsertMarker({ lat: this.StartLocation.latitude, lng: this.StartLocation.longitude }, "start_location", this.StartLocation);
      if (this.DestinationLocation?.latitude && this.DestinationLocation?.longitude) this.upsertMarker({ lat: this.DestinationLocation.latitude, lng: this.DestinationLocation.longitude }, "destination_location", this.DestinationLocation);
    },
    upsertMarker(position, title, meta = {}) {
      
      if (!this.map) return;
      if (!position || typeof position.lat !== "number" || typeof position.lng !== "number") return;

      title = String(title || "").trim();
      var existing = this.markersByKey[title];

      if (existing) {
        if ("position" in existing && !existing.setPosition) {
          existing.position = position;
          if (!existing.map) existing.map = this.map;
        } else {
          if (typeof existing.setPosition === "function") existing.setPosition(position);
          if (!existing.getMap || !existing.getMap()) existing.setMap(this.map);
        }
        this.attachMarkerClickCard(existing, title, meta);
        return;
      }

      var marker;
      if (google?.maps?.marker?.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map: this.map,
          title
        });
      } else {
        marker = new google.maps.Marker({
          position,
          map: this.map,
          title
        });
      }

      this.markersByKey[title] = marker;
      this.attachMarkerClickCard(marker, title, meta);
    },
    attachMarkerClickCard(marker, title, meta) {
      var isAdvanced = "position" in marker && !marker.setPosition;
      var eventName = isAdvanced ? "gmp-click" : "click";
      google.maps.event.clearListeners(marker, eventName);

      google.maps.event.addListener(marker, eventName, () => {
        var content = this.buildCardHtml(title, meta);
        if (this.infoWindow) {
          this.infoWindow.setContent(content);
          var pos = isAdvanced ? marker.position : marker.getPosition();
          this.infoWindow.setPosition(pos);
          this.infoWindow.open({ map: this.map });
        }
      });
    },
    buildCardHtml(title, meta) {
      var name = meta.StartLocation || (meta.formatted_address || '').split(',')[0] || '';
      var address = meta.formatted_address || '';
      var latOk = typeof meta.latitude === 'number';
      var lngOk = typeof meta.longitude === 'number';
      var lat = latOk ? meta.latitude.toFixed(6) : null;
      var lng = lngOk ? meta.longitude.toFixed(6) : null;
      var coords = lat && lng ? `${lat}, ${lng}` : null;
      var placeId = meta.PlaceId || meta.place_id || null;
      var title_formatted = title == 'start_location' ? 'Starting Point' : 'Target Point';

      return `
        <div style="min-width:220px;max-width:300px;padding:12px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.08);">
          <div style="font-weight:600;color:#111827;margin-bottom:6px;">${title_formatted || 'Location'}</div>
          ${name ? `<div style="font-size:13px;color:#374151;margin-bottom:2px;">${name}</div>` : ""}
          ${address ? `<div style="font-size:12px;color:#6b7280;margin-bottom:8px;line-height:1.3">${address}</div>` : ""}
          ${coords ? `
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
              <span style="font-size:12px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:4px 8px;">${coords}</span>
            </div>` : ""
        }
          ${placeId ? `<div style="font-size:11px;color:#9ca3af;margin-bottom:8px;">Place ID: <code style="font-size:11px;color:#6b7280">${placeId}</code></div>` : ""}
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button data-action="set-start"
                    style="font-size:12px;padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;cursor:pointer">
              Başlangıç
            </button>
            <button data-action="set-dest"
                    style="font-size:12px;padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;cursor:pointer">
              Varış
            </button>
            ${coords ? `<a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener"
                  style="font-size:12px;padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;text-decoration:none">
                  Haritada Aç
                </a>` : ""}
          </div>
        </div>
      `;
    },
    clearSelection() {
      if (this.selectedPolyline) {

        this.selectedPolyline.__selected = false;
        this.selectedPolyline.setOptions(BASE_STYLE);
        this.selectedPolyline = null;
        this.selected_polyline_temporary_id = null;
      }
    },
    selectPolyline(pl) {
      if (this.selectedPolyline && this.selectedPolyline !== pl) {
        this.selectedPolyline.__selected = false;
        this.selectedPolyline.setOptions(BASE_STYLE);
      }

      pl.__selected = true;
      pl.setOptions(SELECTED_STYLE);
      this.selectedPolyline = pl;
      this.selected_polyline_temporary_id = pl.__id;

      var selected_polyline_detail = this.decoded_overview_polyline_points.find(function (item) { return item.temporary_route_id == pl.__id });
      this.$emit("selected_polyline_temporary_id", this.selected_polyline_temporary_id);
      this.$emit("selected_polyline_detail", selected_polyline_detail);
    },
    addSelectablePolyline({ map, id, path, meta = {}, onSelect }) {
      var pl = new google.maps.Polyline({
        path,
        ...BASE_STYLE,
        clickable: false,
        map
      });
      pl.__id = id;
      pl.__meta = meta;

      var hit = makeHitArea(path);
      hit.setMap(map);
      hit.__owner = pl;

      hit.addListener('mouseover', () => {
        if (!pl.__selected) pl.setOptions(HOVER_STYLE);
        map.setOptions({ draggableCursor: 'pointer' });
      });
      hit.addListener('mouseout', () => {
        if (!pl.__selected) pl.setOptions(BASE_STYLE);
        map.setOptions({ draggableCursor: null });
      });

      hit.addListener('click', (ev) => {
        onSelect?.(pl, ev);
      });

      pl.__hit = hit;
      return pl;
    },
    drawRoute(decodedPointsArray) {
      if (!this.map || !Array.isArray(decodedPointsArray) || decodedPointsArray.length === 0) return;

      decodedPointsArray.forEach((decoded_route) => {
        var pts = decoded_route?.decoded_overview_polyline_points || [];
        if (!Array.isArray(pts) || pts.length < 2) return;

        var path = pts.map(p => ({ lat: +p.lat, lng: +p.lng }));
        var meta = {
          routeIndex: decoded_route.route_index,
          distanceMeters: decoded_route.distance_meters,
          duration_formatted: decoded_route.duration_formatted,
          provider: decoded_route.provider,
          route_length: decoded_route.route_length,
          temporary_route_id: decoded_route.temporary_route_id,
          distance_mi: decoded_route.distance_mi
        };

        function buildRouteInfoContent(meta) {
          return `
            <div style="
              min-width:240px;max-width:320px;
              border:1px solid #e5e7eb;border-radius:12px;
              background:#fff;box-shadow:0 6px 24px rgba(0,0,0,.08);
              padding:12px 12px 10px; font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial;
            ">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <svg viewBox='0 0 24 24' width="16" height="16" style="color:#ef4444">
                  <path fill="currentColor" d="M12 2a9 9 0 1 1-6.36 2.64A9 9 0 0 1 12 2Zm0 4.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm1 4.5h-2v7h2v-7Z"/>
                </svg>
                <div style="font-weight:700;color:#111827">Route selected</div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px">
                <div style="display:flex;gap:8px;align-items:flex-start">
                  <svg viewBox='0 0 24 24' width="14" height="14" style="margin-top:1px;color:#6b7280">
                    <path fill="currentColor" d="M12 2a6 6 0 1 1-4.24 1.76A6 6 0 0 1 12 2Zm0 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"/>
                  </svg>
                  <div>
                    <div style="color:#6b7280">Distance</div>
                    <div style="font-weight:600;color:#111827">
                      ${meta.distanceMeters} <span style="color:#6b7280;font-weight:500">km</span>
                      <span style="color:#9ca3af"> • ${meta.distance_mi} mi</span>
                    </div>
                  </div>
                </div>

                <div style="display:flex;gap:8px;align-items:flex-start">
                  <svg viewBox='0 0 24 24' width="14" height="14" style="margin-top:1px;color:#6b7280">
                    <path fill="currentColor" d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2Zm1 5h-2v5.2l4.2 2.52 1-1.66L13 10.6V7Z"/>
                  </svg>
                  <div>
                    <div style="color:#6b7280">ETA</div>
                    <div style="font-weight:600;color:#111827">~ ${meta.duration_formatted}</div>
                  </div>
                </div>
              </div>


              <div style="height:1px;background:#f3f4f6;margin:6px 0 8px"></div>

              <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
                <span style="
                  display:inline-flex;align-items:center;gap:6px;
                  border:1px solid #e5e7eb;border-radius:999px;
                  padding:3px 8px;color:#374151;background:#f9fafb;font-size:11px;
                ">
                  <svg viewBox='0 0 24 24' width="12" height="12" style="color:#6b7280">
                    <path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/>
                  </svg>
                  ${meta.provider}
                </span>
              </div>
            </div>`;
        }

        var pl = this.addSelectablePolyline({
          map: this.map,
          id: meta.temporary_route_id,
          path,
          meta,
          onSelect: (poly, ev) => {
            this.selectPolyline(poly);

            var content = buildRouteInfoContent(meta);
            this.infoWindow.setContent(content);
            this.infoWindow.setPosition(ev.latLng);
            this.infoWindow.open({ map: this.map });
          }
        });

        if (decoded_route?.StrokeColor) pl.setOptions({ strokeColor: decoded_route.StrokeColor });
        this.polylines.push(pl);
      });
    },
    fitAll() {

      if (!this.map) return;
      var bounds = new google.maps.LatLngBounds();

      for (var key of Object.keys(this.markersByKey)) {
        var marker = this.markersByKey[key];
        var isAdvanced = "position" in marker && !marker.setPosition;
        var pos = isAdvanced ? marker.position : marker.getPosition?.();
        if (pos) bounds.extend(pos);
      }
      for (var pl of this.polylines) {
        var path = pl.getPath?.();
        if (!path) continue;
        for (var i = 0; i < path.getLength(); i++) bounds.extend(path.getAt(i));
      }

      if (!bounds.isEmpty()) this.map.fitBounds(bounds);
    },
    async getRouteDecodedPolyline(start, dest) {

      var Latitude = start.lat;
      var Longitude = start.lng;
      var DestinationLocationLatitude = dest.lat;
      var DestinationLocationLongitude = dest.lng;

      var res = await axios.post(`/create/polyline`, {
        Latitude, Longitude, DestinationLocationLatitude, DestinationLocationLongitude
      });

      return res.status === 200 ? res.data.routes : [];
    },
    async onBuildRoute() {
      if (!this.isRouteReady || this.isBuilding) return;

      this.isBuilding = true;
      var myToken = ++this.buildToken;

      this.hardResetMap();

      try {
        var s = { lat: this.StartLocation.latitude, lng: this.StartLocation.longitude };
        var d = { lat: this.DestinationLocation.latitude, lng: this.DestinationLocation.longitude };

        var decoded = [];

        if (this.store.calculated_route_detail_active) decoded = this.store.calculated_route_detail_overview_details;
        else decoded = await this.getRouteDecodedPolyline(s, d);

        if( !decoded.length ) return;

        this.decoded_overview_polyline_points = decoded;
        if (myToken !== this.buildToken) return;

        this.drawRoute(decoded);
        this.fitAll();

      } finally {

        if (myToken === this.buildToken) return this.isBuilding = false;
      }
    }
  },

  watch: {
    build_route_button_triggered: {
      handler(newVal) {
        if (newVal) this.onBuildRoute();
      },
      immediate: true, deep: true
    },

    'store.StartLocation': {
      handler(newVal) {
        if (newVal && typeof newVal.latitude === "number" && typeof newVal.longitude === "number") {

          this.StartLocation = newVal;
          var pos = { lat: newVal.latitude, lng: newVal.longitude };
          this.upsertMarker(pos, 'start_location', newVal);

          var hasDest = !!(this.DestinationLocation && typeof this.DestinationLocation.latitude === "number" && typeof this.DestinationLocation.longitude === "number");
          if (hasDest) return this.fitAll();
          else return this.focusOn(pos, { zoomIfCloser: 14 });
        }
      },
      immediate: true, deep: true
    },

    'store.DestinationLocation': {
      handler(newVal) {
        if (newVal && typeof newVal.latitude === "number" && typeof newVal.longitude === "number") {

          this.DestinationLocation = newVal;
          var pos = { lat: newVal.latitude, lng: newVal.longitude };
          this.upsertMarker(pos, 'destination_location', newVal);

          var hasStart = !!(this.StartLocation && typeof this.StartLocation.latitude === "number" && typeof this.StartLocation.longitude === "number");
          if (hasStart) return this.fitAll(); 
          else return this.focusOn(pos, { zoomIfCloser: 13 });
        }
      },
      immediate: true, deep: true
    }
  }
};
</script>

<style scoped>
.gmap-wrap {
  position: relative;
  width: 100%;
  height: clamp(260px, 48vh, 520px);
  margin-top: 15px;
}

@media (min-width: 1024px) {
  .gmap-wrap {
    height: 350px;
  }
}

.gmap-canvas {
  touch-action: pan-y;
  position: absolute;
  inset: 0;
  border-radius: 12px;
}

.gmap-canvas :global(canvas) {
  border-radius: 12px;
}
</style>