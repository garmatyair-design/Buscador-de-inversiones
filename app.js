const tabla = document.getElementById("tabla");

async function cargarDatos() {
  const empresa = document.getElementById("buscarEmpresa").value;
  const tipo = document.getElementById("tipoInversion").value;

  const q = new URLSearchParams();
  if (empresa) q.append("empresa", empresa);
  if (tipo) q.append("tipo", tipo);

  const r = await fetch("/api/inversiones?" + q.toString());
  const data = await r.json();

  tabla.innerHTML = data
    .map(
      i => `
    <tr>
      <td>${i.empresa}</td>
      <td>${i.tipo_inversion}</td>
      <td>${i.sector}</td>
      <td>${i.anio_inicio}</td>
      <td>${i.fuente_nombre}</td>
      <td><a href="${i.url}" target="_blank">Fuente</a></td>
    </tr>`
    )
    .join("");
}

document.getElementById("buscarTop").onclick = async () => {
  try { await fetch("/api/buscarAutomatico"); } catch {}
  try { await fetch("/api/rssFetcher"); } catch {}
  cargarDatos();
};

document.getElementById("buscarEmpresa").oninput = cargarDatos;
document.getElementById("tipoInversion").onchange = cargarDatos;

cargarDatos();
