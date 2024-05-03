const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');

const server = http.createServer(async (req, res) => {
  try {
    // Hacemos la solicitud HTTP a la página de Wikipedia
    const response = await axios.get('https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap');
    const html = response.data;

    // Cargamos el HTML en Cheerio para manipularlo
    const $ = cheerio.load(html);

    // Extraemos el título (h1)
    const titulo = $('h1').text();

    // Extraemos todas las imágenes ('img')
    const imagenes = $('img').map((i, el) => $(el).attr('src')).get();

    // Extraemos todos los textos ('p')
    const textos = $('p').map((i, el) => $(el).text()).get();

    // Enviamos los datos recopilados como respuesta
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ titulo, imagenes, textos }));
  } catch (error) {
    console.error('Error:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno del servidor');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
