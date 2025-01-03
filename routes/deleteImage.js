// routes/deleteImage.js
import path from "path";
import fs from "fs";
import { authorizedExtensions } from "../utils/imageMIMEtypes.js";

/**
 * @description Supprime une image existante dans le dossier images
 * @param {Object} req Requête HTTP
 * @param {Object} res Réponse HTTP
 * @returns {Object} Réponse HTTP
 */
export const deleteImage = (req, res) => {
  // Récupère le paramètre 'name' depuis la requête
  const providedName = req.query.name;

  // Vérifie si le paramètre 'name' est fourni
  if (!providedName) {
    console.log(
      "imgStocker ~> DELETE: /deleteImage ~> status: 400 (paramètre 'name' manquant)"
    );
    return res.status(400).json({ message: "Paramètre 'name' manquant" });
  }

  // Sanitization du nom de fichier fourni
  const sanitizedName = path.basename(providedName);

  // Chemin vers le dossier images
  const imagesDir = path.join(process.cwd(), "images");

  // Lire le contenu du dossier images
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier images:", err);
      console.log(
        "imgStocker ~> DELETE: /deleteImage ~> status: 500 (erreur serveur)"
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }

    // Chercher un fichier correspondant au nom fourni
    const matchedFile = files.find((file) => {
      const fileExt = path.extname(file).toLowerCase();
      if (!authorizedExtensions.includes(fileExt)) return false;

      // Supposons que le fichier unique est préfixé par un UUID suivi d'un '_'
      const expectedSuffix = `_${sanitizedName}${fileExt}`;
      return file.endsWith(expectedSuffix);
    });

    if (!matchedFile) {
      console.log(
        `imgStocker ~> DELETE: /deleteImage ~> status: 404 (image '${sanitizedName}' non trouvée)`
      );
      return res.status(404).json({ message: "Image non trouvée" });
    }

    // Chemin complet du fichier trouvé
    const filePath = path.join(imagesDir, matchedFile);

    // Supprimer le fichier
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image:", err);
        console.log(
          "imgStocker ~> DELETE: /deleteImage ~> status: 500 (erreur lors de la suppression)"
        );
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression de l'image" });
      }
      console.log(
        `imgStocker ~> DELETE: /deleteImage ~> status: 200 (image '${matchedFile}' supprimée avec succès)`
      );
      res.status(200).json({
        message: "Image supprimée avec succès",
        filename: matchedFile,
      });
    });
  });
};
