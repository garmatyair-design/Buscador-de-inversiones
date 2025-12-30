let CACHE = [];

export default async function handler(req, res) {
  const { empresa, tipo } = req.query;

  let data = CACHE;

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

export function agregar(datos) {
  const urls = new Set(CACHE.map(d => d.url));
  datos.forEach(d => {
    if (!urls.has(d.url)) CACHE.push(d);
  });
}
