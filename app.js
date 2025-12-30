const lista = document.getElementById("resultados");
const filtroTipo = document.getElementById("filtroTipo");

let mapa = L.map("mapa").setView([23.6345, -102.5528], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapa);

let marcadores = [];

function limpiarMapa() {
  marcadores.forEach(m => mapa.removeLayer(m));
  marcadores = [];
}

async function cargarDatos(url) {
  const res = await fetch(url);
  let data = await res.json();

  const tipoSeleccionado = filtroTipo.value;
  if (tipoSeleccionado !== "TODOS") {
    data = data.filter(inv => inv.tipo === tipoSeleccionado);
  }

  lista.innerHTML = "";
  limpiarMapa();

  data.forEach(inv => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${inv.titulo}</strong><br>
      Empresa: ${inv.empresa}<br>
      Sector: ${inv.sector}<br>
      Tipo: ${inv.tipo}<br>
      Año: ${inv.anio_inicio} / Semestre ${inv.semestre}<br>
      Fuente: ${inv.fuente_nombre}<br>
      <a href="${inv.url}" target="_blank">Ver fuente</a>
    `;
    lista.appendChild(li);

    if (inv.lat && inv.lng) {
      const marker = L.marker([inv.lat, inv.lng])
        .addTo(mapa)
        .bindPopup(`
          <strong>${inv.empresa}</strong><br>
          ${inv.sector}<br>
          ${inv.tipo}
        `);
      marcadores.push(marker);
    }
  });
}

document.getElementById("buscarTop").onclick = () => {
  cargarDatos("/api/inversiones?modo=top");
};

document.getElementById("buscarHistorico").onclick = () => {
  cargarDatos("/api/inversiones?modo=historico");
};
