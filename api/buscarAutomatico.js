import fs from "fs";
import path from "path";

const HISTORICO = path.join(process.cwd(), "data/historico.json");

export default async function handler(req, res) {
  const query = `
    nueva planta OR expansión OR inversión OR abre planta
    México
  `;

  const response = await fetch(
    `https://api.bing.microsoft.com/v7.0/news/search?q=${encodeURIComponent(query)}&freshness=300&count=20`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY
      }
    }
  );

  const data = await response.json();
  const resultados = data.value.map(n => normalizar(n));
  guardar(resultados);

  res.status(200).json({ ok: true, encontrados: resultados.length });
}

function normalizar(n) {
  const fecha = new Date(n.datePublished);
  return {
    titulo: n.name,
    empresa: n.name.split(" ")[0],
    sector: detectarSector(n.name),
    tipo: detectarTipo(n.name),
    monto: "No divulgado",
    anio_inicio: fecha.getFullYear(),
    semestre: fecha.getMonth() >= 6 ? 2 : 1,
    fuente_nombre: n.provider?.[0]?.name || "Medio digital",
    fuente_tipo: "Noticia indexada",
    lat: null,
    lng: null,
    url: n.url
  };
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

function detectarTipo(t) {
  t = t.toLowerCase();
  if (t.includes("planta")) return "PLANTA NUEVA";
  if (t.includes("expans")) return "EXPANSIÓN";
  if (t.includes("almac") || t.includes("cedis")) return "ALMACÉN";
  return "OTRO";
}

function detectarSector(t) {
  t = t.toLowerCase();
  if (t.includes("automotr")) return "Automotriz";
  if (t.includes("energ")) return "Energía";
  if (t.includes("logíst")) return "Logística";
  if (t.includes("data")) return "Tecnología";
  return "Multisector";
}
