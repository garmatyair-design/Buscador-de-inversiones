let inversiones = [];
let markers = [];

async function buscarInversiones() {
  const res = await fetch("/api/fuentesMasivas");
  inversiones = await res.json();
  renderTabla();
  renderMapa();
}

function renderTabla() {
  const tbody = document.getElementById("tabla");
  tbody.innerHTML = "";

  inversiones.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>${i.empresa}</td>
        <td>${i.tipo_inversion}</td>
        <td>${i.sector}</td>
        <td>${i.anio_inicio}</td>
        <td><a href="${i.url}" target="_blank">Fuente</a></td>
      </tr>`;
  });
}

function renderMapa() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  inversiones.forEach(i => {
    const marker = L.marker([i.lat, i.lng])
      .addTo(map)
      .bindPopup(`<b>${i.empresa}</b><br>${i.tipo_inversion}`);
    markers.push(marker);
  });
}

document.getElementById("buscarTop").addEventListener("click", buscarInversiones);
