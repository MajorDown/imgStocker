// src/index.ts
import express from 'express';
import fileUpload from 'express-fileupload';
import uploadImage from './routes/uploadImage'; // Import par défaut

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour gérer les uploads de fichiers
app.use(fileUpload());

// Route POST /upload
app.post('/upload', uploadImage);

// Route GET pour vérifier le serveur
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
