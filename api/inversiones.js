import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "inversiones.json");

  if (!fs.existsSync(filePath)) {
    return res.status(200).json([]);
  }

  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // FILTRO DESDE 2° SEMESTRE 2025 EN ADELANTE
  data = data.filter(inv => {
    if (inv.anio_inicio > 2025) return true;
    if (inv.anio_inicio === 2025 && inv.semestre >= 2) return true;
    return false;
  });

  // ORDENAR POR FECHA MÁS RECIENTE
  data.sort((a, b) => {
    if (b.anio_inicio !== a.anio_inicio) {
      return b.anio_inicio - a.anio_inicio;
    }
    return (b.semestre || 1) - (a.semestre || 1);
  });

  const modo = req.query.modo || "top";

  if (modo === "historico") {
    return res.status(200).json(data);
  }

  // TOP 10 POR RECIENCIA
  res.status(200).json(data.slice(0, 10));
}
