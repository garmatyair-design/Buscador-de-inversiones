export default async function handler(req, res) {
  if (!process.env.BING_API_KEY) {
    return res.status(200).json({
      ok: false,
      mensaje: "BING_API_KEY no configurada, se omite Bing"
    });
  }

  const query = `
    inversiones México planta nueva expansión inversión industrial
    site:mx 2025 2026 2027 2028 2029 2030
  `;

  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(
    query
  )}&count=20`;

  try {
    const r = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY
      }
    });

    const data = await r.json();

    if (!data.webPages) {
      return res.status(200).json({ ok: true, resultados: 0 });
    }

    const noticias = data.webPages.value.map(n => ({
      titulo: n.name,
      url: n.url,
      fuente_nombre: n.displayUrl,
      fuente_tipo: "Bing Search",
      fecha: new Date().toISOString()
    }));

    res.status(200).json({ ok: true, noticias });
  } catch (e) {
    res.status(200).json({
      ok: false,
      error: "Error Bing controlado"
    });
  }
}
