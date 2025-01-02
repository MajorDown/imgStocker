import express, { Request, Response } from 'express';

// Créer une instance d'Express
const app = express();

const PORT = process.env.PORT;

// Middleware pour parser les requêtes JSON
app.use(express.json());


// route POST pour uploader une image
app.post('/upload', (req: Request, res: Response) => {
  console.log("imgStocker ~> request POST /upload");
  res.send('Image uploadée');
});

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`imgStocker lancé sur le port ${PORT}`);
});
