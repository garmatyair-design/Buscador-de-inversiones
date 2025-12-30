// 1. Inicializar mapa (OBLIGATORIO)
const map = L.map("mapa").setView([23.6345, -102.5528], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let markers = [];

// 2. Datos de prueba (para validar que TODO funciona)
let inversiones = [
  {
    empresa: "Empresa Ejemplo",
    tipo_inversion: "PLANTA NUEVA",
    anio_inicio: 2026,
    lat: 25.6866,
    lng: -100.3161
  }
];

// 3. Render tabla
function renderTabla() {
  const tbody = document.getElementById("tabla");
  tbody.innerHTML = "";

  inversiones.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>${i.empresa}</td>
        <td>${i.tipo_inversion}</td>
        <td>${i.anio_inicio}</td>
      </tr>`;
  });
}

// 4. Render mapa
function renderMapa() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  inversiones.forEach(i => {
    const m = L.marker([i.lat, i.lng])
      .addTo(map)
      .bindPopup(`<b>${i.empresa}</b><br>${i.tipo_inversion}`);
    markers.push(m);
  });
}

// 5. Botón
document.getElementById("buscarTop").addEventListener("click", () => {
  renderTabla();
  renderMapa();
});

// Render inicial
renderTabla();
renderMapa();
