/***********************
 * INICIALIZACIÓN MAPA *
 ***********************/
const map = L.map("mapa").setView([23.6345, -102.5528], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let markers = [];

/************************
 * ESTADO DE APLICACIÓN *
 ************************/
let inversiones = [];

/*****************
 * RENDER TABLA  *
 *****************/
function renderTabla() {
  const tbody = document.getElementById("tabla");
  tbody.innerHTML = "";

  if (inversiones.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No hay inversiones encontradas</td>
      </tr>`;
    return;
  }

  inversiones.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>${i.empresa || "-"}</td>
        <td>${i.tipo_inversion || "-"}</td>
        <td>${i.sector || "-"}</td>
        <td>${i.anio_inicio || "-"}</td>
        <td>
          <a href="${i.url}" target="_blank">Fuente</a>
        </td>
      </tr>`;
  });
}

/*****************
 * RENDER MAPA  *
 *****************/
function renderMapa() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  inversiones.forEach(i => {
    if (!i.lat || !i.lng) return;

    const marker = L.marker([i.lat, i.lng])
      .addTo(map)
      .bindPopup(`
        <strong>${i.empresa || "Empresa"}</strong><br/>
        ${i.tipo_inversion || ""}<br/>
        ${i.anio_inicio || ""}
      `);

    markers.push(marker);
  });
}

/***********************
 * BUSCAR INVERSIONES *
 ***********************/
async function buscarInversiones() {
  try {
    console.log("Buscando inversiones...");

    const res = await fetch("/api/fuentesMasivas");

    if (!res.ok) {
      console.error("Respuesta inválida del servidor");
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Formato de datos incorrecto", data);
      return;
    }

    inversiones = data;

    console.log(`Inversiones encontradas: ${inversiones.length}`);

    renderTabla();
    renderMapa();
  } catch (err) {
    console.error("Error al buscar inversiones:", err);
  }
}

/*****************
 * EVENTOS UI   *
 *****************/
const boton = document.getElementById("buscarTop");
if (boton) {
  boton.addEventListener("click", buscarInversiones);
} else {
  console.error("No se encontró el botón buscarTop");
}

/*****************
 * CARGA INICIAL *
 *****************/
renderTabla();
renderMapa();
