const lista = document.getElementById("resultados");
const filtroTipo = document.getElementById("filtroTipo");
const buscadorEmpresa = document.getElementById("buscadorEmpresa");

let mapa = L.map("mapa").setView([23.6, -102.5], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapa);

let marcadores = [];

function limpiarMapa() {
  marcadores.forEach(m => mapa.removeLayer(m));
  marcadores = [];
}

async function cargarDatos() {
  const res = await fetch("/api/inversiones");
  let data = await res.json();

  if (filtroTipo.value !== "TODOS") {
    data = data.filter(d => d.tipo === filtroTipo.value);
  }

  const empresa = buscadorEmpresa.value.toLowerCase();
  if (empresa) {
    data = data.filter(d => d.empresa.toLowerCase().includes(empresa));
  }

  lista.innerHTML = "";
  limpiarMapa();

  if (data.length === 0) {
    lista.innerHTML = "<li>No hay resultados</li>";
    return;
  }

  data.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${d.titulo}</strong><br>
      Empresa: ${d.empresa}<br>
      Sector: ${d.sector}<br>
      Tipo: ${d.tipo}<br>
      Fecha: ${d.anio_inicio} S${d.semestre}<br>
      Fuente: ${d.fuente_nombre}<br>
      <a href="${d.url}" target="_blank">Ver fuente</a>
    `;
    lista.appendChild(li);

    if (d.lat && d.lng) {
      const m = L.marker([d.lat, d.lng])
        .addTo(mapa)
        .bindPopup(`<strong>${d.empresa}</strong><br>${d.tipo}`);
      marcadores.push(m);
    }
  });
}

document.getElementById("buscarTop").onclick = async () => {
  await fetch("/api/buscarAutomatico");
  await fetch("/api/rssFetcher");
  cargarDatos();
};

document.getElementById("buscarHistorico").onclick = cargarDatos;
