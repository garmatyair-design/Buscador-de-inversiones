import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const file = path.join(process.cwd(), "data/historico.json");
  if (!fs.existsSync(file)) return res.status(200).json([]);

  let data = JSON.parse(fs.readFileSync(file));

  data = data.filter(d =>
    d.anio_inicio > 2025 ||
    (d.anio_inicio === 2025 && d.semestre >= 2)
  );

  data.sort((a, b) => b.anio_inicio - a.anio_inicio);
  res.status(200).json(data);
}
