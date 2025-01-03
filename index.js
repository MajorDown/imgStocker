// index.js
import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

import { postImage } from "./routes/postImage.js";
import { getImage } from "./routes/getImage.js";
import { updateImage } from "./routes/updateImage.js";
import { deleteImage } from "./routes/deleteImage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour gérer les fichiers téléchargés
app.use(fileUpload());

// Déterminer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assurez-vous que le dossier images existe
const imagesDir = path.join(__dirname, "images");
mkdir(imagesDir, { recursive: true }).catch(console.error);

// Définir les routes CRUD
app.post("/postImage", postImage);
app.get("/getImage", getImage);
app.put("/updateImage", updateImage);
app.delete("/deleteImage", deleteImage);

// Gestion des routes non définies
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
