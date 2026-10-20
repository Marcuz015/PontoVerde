<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
import type { DisposalPoint } from "../types";
import { hasCoordinates, routeUrl } from "../utils";
import Icon from "./Icon.vue";
import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
const props = defineProps<{
  points: DisposalPoint[];
  city?: string;
  selected?: string;
  location?: [number, number] | null;
}>();
const emit = defineEmits<{ select: [id: string] }>();
const element = ref<HTMLElement>();
const failed = ref(false);
const loaded = ref(false);
let map: Leaflet.Map | undefined;
let layer: Leaflet.LayerGroup;
let L: typeof Leaflet;
let observer: ResizeObserver | undefined;
const markers = new Map<string, Leaflet.Marker>();
// City centers are navigation reference coordinates, never disposal point markers.
const centers: Record<string, [number, number]> = {
  Salto: [-23.2, -47.287],
  Itu: [-23.264, -47.299],
  Tietê: [-23.101, -47.715],
  Cabreúva: [-23.307, -47.133],
};
function redraw() {
  if (!map || !L) return;
  layer.clearLayers();
  markers.clear();
  const mapped = props.points.filter(hasCoordinates);
  mapped.forEach((p) => {
    const marker = L.marker([p.latitude!, p.longitude!], {
      icon: L.divIcon({
        className: "pv-marker",
        html: '<span aria-hidden="true">♻</span>',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
      }),
      title: p.name,
      alt: p.name,
    });
    const popup = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = p.name;
    const link = document.createElement("a");
    link.href = routeUrl(p);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Como chegar ↗";
    popup.append(title, document.createElement("br"), link);
    marker
      .bindPopup(popup)
      .on("click", () => emit("select", p.id))
      .addTo(layer);
    markers.set(p.id, marker);
  });
  if (props.location)
    L.circleMarker(props.location, {
      radius: 7,
      fillColor: "#174c34",
      color: "#fff",
      weight: 3,
      fillOpacity: 1,
    })
      .bindTooltip("Sua localização aproximada")
      .addTo(layer);
  if (mapped.length)
    map.fitBounds(
      L.latLngBounds(
        mapped.map((p) => [p.latitude!, p.longitude!] as [number, number]),
      ),
      { padding: [45, 45], maxZoom: 15 },
    );
  else
    map.setView(
      centers[props.city || ""] || [-23.22, -47.4],
      props.city ? 12 : 10,
    );
  select();
}
function select() {
  markers.forEach((m, id) => {
    m.getElement()?.classList.toggle("is-selected", id === props.selected);
  });
  const marker = props.selected ? markers.get(props.selected) : undefined;
  if (marker && map) {
    marker.openPopup();
    map.panTo(marker.getLatLng());
  }
}
onMounted(async () => {
  try {
    L = await import("leaflet");
    await nextTick();
    if (!element.value) return;
    map = L.map(element.value, { scrollWheelZoom: false }).setView(
      [-23.22, -47.4],
      10,
    );
    let tileFailures = 0;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    })
      .on("tileerror", () => {
        if (++tileFailures > 3) failed.value = true;
      })
      .on("tileload", () => {
        loaded.value = true;
        failed.value = false;
        tileFailures = 0;
      })
      .addTo(map);
    layer = L.layerGroup().addTo(map);
    redraw();
    observer = new ResizeObserver(() => map?.invalidateSize());
    observer.observe(element.value);
  } catch {
    failed.value = true;
  }
});
watch(() => [props.points, props.city, props.location], redraw, { deep: true });
watch(() => props.selected, select);
onBeforeUnmount(() => {
  observer?.disconnect();
  map?.remove();
});
</script>
<template>
  <div class="map-wrap">
    <div
      ref="element"
      class="leaflet-map"
      aria-label="Mapa dos pontos de descarte"
    />
    <div v-if="failed" class="map-notice" role="alert">
      <Icon name="AlertCircle" :size="17" /> Não foi possível carregar o mapa.
      Use a lista de pontos.
    </div>
    <div v-else-if="loaded && !points.some(hasCoordinates)" class="map-notice">
      <Icon name="MapPin" :size="17" /> Ainda não há coordenadas verificadas
      para esta busca.
    </div>
  </div>
</template>
