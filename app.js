const lista = document.getElementById("resultados");

async function cargarDatos(url) {
  const res = await fetch(url);
  const data = await res.json();
  lista.innerHTML = "";

  if (data.length === 0) {
    lista.innerHTML = "<li>No hay registros</li>";
    return;
  }

  data.forEach(inv => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${inv.titulo}</strong><br>
      Empresa: ${inv.empresa}<br>
      Tipo: ${inv.tipo}<br>
      Monto: ${inv.monto}<br>
      Fecha: ${inv.fecha}<br>
      <a href="${inv.url}" target="_blank">Ver fuente</a>
    `;
    lista.appendChild(li);
  });
}

document.getElementById("buscarTop").addEventListener("click", () => {
  cargarDatos("/api/inversiones?modo=top");
});

document.getElementById("buscarHistorico").addEventListener("click", () => {
  cargarDatos("/api/inversiones?modo=historico");
});
