import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data/inversiones.json");

export default function handler(req, res) {
  if (!fs.existsSync(DATA)) {
    return res.status(200).json([]);
  }

  let data = JSON.parse(fs.readFileSync(DATA));

  const { empresa, tipo } = req.query;

  if (empresa) {
    data = data.filter(d =>
      d.empresa.toLowerCase().includes(empresa.toLowerCase())
    );
  }

  if (tipo) {
    data = data.filter(d => d.tipo_inversion === tipo);
  }

  res.status(200).json(data);
}
