<template>
  <div id="map" class="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import io from 'socket.io-client'
const baseURL = import.meta.env.VITE_BASE_URL

export default {
  props: {
    trainInfo: String
  },
  data() {
    return {
      center: [62.173276, 14.942265]
    }
  },
  methods: {
    setupMap: function () {
      const socket = io(`${baseURL}/`)

      this.map = L.map('map').setView(this.center, 5)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map)

      let markers = {}

      let trainMarker = L.icon({
            iconUrl: "icons/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
      });

      socket.on('message', (data) => {
        if (data.trainnumber in markers) {
          let marker = markers[data.trainnumber]

          marker.setLatLng(data.position)
        } else {
          let marker = L.marker(data.position, {icon: trainMarker}).bindPopup(data.trainnumber).addTo(this.map)

          markers[data.trainnumber] = marker
        }
      })
    }
  },
  mounted() {
    this.setupMap()
  },
  updated() {
    console.log(this.trainInfo);
  }
  // beforeDestroy() {
  //     this.socket.disconnect();
  // }
}
</script>

<style scoped>
.map {
  height: 100vh;
  width: 60vw;
}
</style>
