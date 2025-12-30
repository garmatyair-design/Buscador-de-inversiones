import fs from "fs";
import path from "path";

function normalizarMonto(monto) {
  if (!monto) return 0;
  let valor = parseFloat(monto.replace(/[^0-9.]/g, ""));
  if (monto.includes("MDD")) valor *= 1000;
  return valor;
}

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "inversiones.json");

  if (!fs.existsSync(filePath)) {
    return res.status(200).json([]);
  }

  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // FILTRO 2026–2030
  data = data.filter(
    inv => inv.anio_inicio >= 2026 && inv.anio_inicio <= 2030
  );

  data.forEach(inv => {
    inv._montoNumerico = normalizarMonto(inv.monto);
  });

  const modo = req.query.modo || "top";

  if (modo === "historico") {
    data.sort((a, b) => b.anio_inicio - a.anio_inicio);
    return res.status(200).json(data);
  }

  data.sort((a, b) => b._montoNumerico - a._montoNumerico);
  res.status(200).json(data.slice(0, 10));
}
