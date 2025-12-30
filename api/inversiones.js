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

  data.forEach(inv => {
    inv._montoNumerico = normalizarMonto(inv.monto);
  });

  const modo = req.query.modo || "top";

  if (modo === "historico") {
    data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return res.status(200).json(data);
  }

  // Top 10 por monto
  data.sort((a, b) => b._montoNumerico - a._montoNumerico);
  res.status(200).json(data.slice(0, 10));
}
