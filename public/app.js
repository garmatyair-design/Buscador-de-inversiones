const tabla = document.getElementById("tabla");

const map = L.map("mapa").setView([23.6, -102.5], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let markers = [];

async function cargarDatos() {
  const empresa = document.getElementById("buscarEmpresa").value;
  const tipo = document.getElementById("tipoInversion").value;

  const q = new URLSearchParams();
  if (empresa) q.append("empresa", empresa);
  if (tipo) q.append("tipo", tipo);

  const r = await fetch("/api/inversiones?" + q);
  const data = await r.json();

  tabla.innerHTML = "";
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(i => {
    tabla.innerHTML += `
      <tr>
        <td>${i.empresa}</td>
        <td>${i.tipo_inversion}</td>
        <td>${i.sector}</td>
        <td>${i.anio_inicio}</td>
        <td><a href="${i.url}" target="_blank">Fuente</a></td>
      </tr>`;

    const m = L.marker([i.lat, i.lng])
      .addTo(map)
      .bindPopup(`<b>${i.empresa}</b><br>${i.tipo_inversion}`);
    markers.push(m);
  });
}

document.getElementById("buscarTop").onclick = async () => {
  await fetch("/api/rssFetcher");
  cargarDatos();
};

document.getElementById("buscarEmpresa").oninput = cargarDatos;
document.getElementById("tipoInversion").onchange = cargarDatos;

cargarDatos();
