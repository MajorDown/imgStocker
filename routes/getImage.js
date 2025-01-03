// routes/getImage.js
import path from "path";
import fs from "fs";
import { authorizedExtensions } from "../utils/imageMIMEtypes";

/**
 * @description Récupère une image du dossier images en fonction du nom fourni
 * @param {Object} req Requête HTTP
 * @param {Object} res Réponse HTTP
 * @returns {Object} Réponse HTTP
 */
export const getImage = (req, res) => {
  // Récupère le paramètre 'name' depuis la requête
  // exemple : /getImage?name=monImage
  const providedName = req.query.name;

  // Vérifie si le paramètre 'name' est fourni
  if (!providedName) {
    console.log(
      "imgStocker ~> GET: /getImage ~> status: 400 (paramètre 'name' manquant)"
    );
    return res.status(400).json({ message: "Paramètre 'name' manquant" });
  }

  // Chemin vers le dossier images
  const imagesDir = path.join(process.cwd(), "images");

  // Lire le contenu du dossier images
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier images:", err);
      console.log(
        "imgStocker ~> GET: /getImage ~> status: 500 (erreur serveur)"
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }

    // Chercher un fichier correspondant au nom fourni
    const matchedFile = files.find((file) => {
      const fileExt = path.extname(file).toLowerCase();
      if (!authorizedExtensions.includes(fileExt)) return false;

      const nameWithExt = `_${providedName}${fileExt}`;
      return file.endsWith(nameWithExt);
    });

    if (!matchedFile) {
      console.log(
        `imgStocker ~> GET: /getImage ~> status: 404 (image '${providedName}' non trouvée)`
      );
      return res.status(404).json({ message: "Image non trouvée" });
    }

    // Chemin complet du fichier trouvé
    const filePath = path.join(imagesDir, matchedFile);

    // Envoyer le fichier en réponse
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Erreur lors de l'envoi de l'image:", err);
        console.log(
          "imgStocker ~> GET: /getImage ~> status: 500 (erreur lors de l'envoi)"
        );
        res.status(500).json({ message: "Erreur lors de l'envoi de l'image" });
      } else {
        console.log(
          `imgStocker ~> GET: /getImage ~> status: 200 (image '${matchedFile}' envoyée)`
        );
      }
    });
  });
};
