// index.js
const http = require("http");

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Serveur en marche");
});

server.listen(PORT, () => {
  console.log(`imgStocker lancé sur le port ${PORT}`);
});
