export default async function handler(req, res) {
  const FUENTES = [
    { nombre: "México Industry", url: "https://mexicoindustry.com/feed/" },
    { nombre: "Cluster Industrial", url: "https://clusterindustrial.com.mx/feed/" },
    { nombre: "El Economista", url: "https://www.eleconomista.com.mx/rss/empresas.xml" },
    { nombre: "Expansión", url: "https://expansion.mx/rss/empresas" },
    { nombre: "Forbes México", url: "https://www.forbes.com.mx/feed/" },
    { nombre: "Mundo Ejecutivo", url: "https://mundoejecutivo.com.mx/feed/" },
    { nombre: "T21 Logística", url: "https://t21.com.mx/rss.xml" },
    { nombre: "Inmobiliare", url: "https://inmobiliare.com/feed/" },
    { nombre: "Retailers.mx", url: "https://retailers.mx/feed/" }
  ];

  let resultados = [];

  for (const f of FUENTES) {
    try {
      const xml = await fetch(f.url).then(r => r.text());
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

      for (const i of items) {
        const titulo = extraer(i[1], "title");
        const link = extraer(i[1], "link");
        const fechaTxt = extraer(i[1], "pubDate");

        if (!titulo || !link || !fechaTxt) continue;
        if (!esInversion(titulo)) continue;

        const fecha = new Date(fechaTxt);
        const anio = fecha.getFullYear();
        const semestre = fecha.getMonth() >= 6 ? 2 : 1;

        if (anio < 2025) continue;
        if (anio === 2025 && semestre === 1) continue;

        resultados.push({
          empresa: detectarEmpresa(titulo),
          titulo,
          tipo_inversion: detectarTipo(titulo),
          sector: "MULTISECTOR",
          anio_inicio: anio,
          fuente: f.nombre,
          url: link,
          lat: 23.6345,
          lng: -102.5528
        });
      }
    } catch {}
  }

  res.status(200).json(resultados);
}

function extraer(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].replace(/<!\\[CDATA\\[|\\]\\]>/g, "").trim() : null;
}

function esInversion(t) {
  t = t.toLowerCase();
  return (
    t.includes("invers") ||
    t.includes("planta") ||
    t.includes("expansi") ||
    t.includes("fábrica") ||
    t.includes("almacén") ||
    t.includes("producción")
  );
}

function detectarTipo(t) {
  t = t.toLowerCase();
  if (t.includes("planta")) return "PLANTA NUEVA";
  if (t.includes("expansi")) return "EXPANSIÓN";
  return "INVERSIÓN";
}

function detectarEmpresa(t) {
  return t.split(" ")[0];
}
