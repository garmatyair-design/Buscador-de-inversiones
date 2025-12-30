import Parser from "rss-parser";
import fs from "fs";
import path from "path";

const parser = new Parser();
const HISTORICO = path.join(process.cwd(), "data/historico.json");

const FEEDS = [
  "https://mexicoindustry.com/rss",
  "https://clusterindustrial.com.mx/rss"
];

export default async function handler(req, res) {
  let resultados = [];

  for (const feed of FEEDS) {
    const rss = await parser.parseURL(feed);
    rss.items.forEach(item => {
      const fecha = new Date(item.pubDate);
      resultados.push({
        titulo: item.title,
        empresa: item.title.split(" ")[0],
        sector: "Industrial",
        tipo: detectarTipo(item.title),
        monto: "No divulgado",
        anio_inicio: fecha.getFullYear(),
        semestre: fecha.getMonth() >= 6 ? 2 : 1,
        fuente_nombre: rss.title,
        fuente_tipo: "RSS oficial",
        lat: null,
        lng: null,
        url: item.link
      });
    });
  }

  guardar(resultados);
  res.status(200).json({ ok: true, rss: resultados.length });
}

function detectarTipo(t) {
  t = t.toLowerCase();
  if (t.includes("planta")) return "PLANTA NUEVA";
  if (t.includes("expans")) return "EXPANSIÓN";
  return "OTRO";
}

function guardar(nuevos) {
  let actual = fs.existsSync(HISTORICO)
    ? JSON.parse(fs.readFileSync(HISTORICO))
    : [];

  const urls = new Set(actual.map(a => a.url));
  nuevos.forEach(n => {
    if (!urls.has(n.url)) actual.push(n);
  });

  fs.writeFileSync(HISTORICO, JSON.stringify(actual, null, 2));
}
