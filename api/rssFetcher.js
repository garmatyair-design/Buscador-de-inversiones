import { agregar } from "./inversiones";

const FEEDS = [
  {
    nombre: "México Industry",
    url: "https://mexicoindustry.com/feed/"
  },
  {
    nombre: "Cluster Industrial",
    url: "https://clusterindustrial.com.mx/feed/"
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
        if (fecha.getFullYear() < 2025) continue;

        nuevas.push({
          titulo,
          empresa: titulo.split(" ")[0],
          sector: "Industrial",
          tipo_inversion: detectarTipo(titulo),
          anio_inicio: fecha.getFullYear(),
          fuente_nombre: feed.nombre,
          fuente_tipo: "RSS",
          lat: 23.6345,
          lng: -102.5528,
          url: link
        });
      }
    } catch {}
  }

  agregar(nuevas);
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
  return "INVERSIÓN";
}
