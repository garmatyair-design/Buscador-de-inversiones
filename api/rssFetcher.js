import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data/inversiones.json");

const FEEDS = [
  {
    nombre: "México Industry",
    url: "https://mexicoindustry.com/feed/",
    sector: "Industrial"
  },
  {
    nombre: "Cluster Industrial",
    url: "https://clusterindustrial.com.mx/feed/",
    sector: "Industrial"
  }
];

export default async function handler(req, res) {
  let nuevas = [];

  for (const feed of FEEDS) {
    try {
      const xml = await fetch(feed.url).then(r => r.text());
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

      for (const i of items) {
        const titulo = tag(i[1], "title");
        const link = tag(i[1], "link");
        const pubDate = tag(i[1], "pubDate");

        if (!titulo || !link || !pubDate) continue;

        const fecha = new Date(pubDate);
        const anio = fecha.getFullYear();
        const semestre = fecha.getMonth() >= 6 ? 2 : 1;

        if (anio < 2025) continue;

        nuevas.push({
          titulo,
          empresa: detectarEmpresa(titulo),
          sector: feed.sector,
          tipo_inversion: detectarTipo(titulo),
          monto: "No divulgado",
          anio_inicio: anio,
          semestre,
          fuente_nombre: feed.nombre,
          fuente_tipo: "RSS oficial",
          lat: null,
          lng: null,
          url: link
        });
      }
    } catch (e) {
      // No rompe el sistema
    }
  }

  guardar(nuevas);
  res.status(200).json({ ok: true, agregadas: nuevas.length });
}

function tag(xml, t) {
  const m = xml.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`));
  return m ? m[1].replace(/<!\\[CDATA\\[|\\]\\]>/g, "").trim() : null;
}

function detectarTipo(t) {
  t = t.toLowerCase();
  if (t.includes("planta")) return "PLANTA NUEVA";
  if (t.includes("expansi")) return "EXPANSIÓN";
  if (t.includes("invers")) return "INVERSIÓN";
  return "OTRO";
}

function detectarEmpresa(t) {
  return t.split(" ")[0];
}

function guardar(nuevas) {
  let actual = fs.existsSync(DATA)
    ? JSON.parse(fs.readFileSync(DATA))
    : [];

  const urls = new Set(actual.map(a => a.url));

  nuevas.forEach(n => {
    if (!urls.has(n.url)) actual.push(n);
  });

  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, JSON.stringify(actual, null, 2));
}
