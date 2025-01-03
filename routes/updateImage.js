// routes/updateImage.js
import path from "path";
import fs from "fs";
import {
  authorizedMimetypes,
  authorizedExtensions,
} from "../utils/imageMIMEtypes.js";

/**
 * @description Met à jour une image existante dans le dossier images
 * @param {Object} req Requête HTTP
 * @param {Object} res Réponse HTTP
 * @returns {Object} Réponse HTTP
 */
export const updateImage = (req, res) => {
  // Vérifie si un fichier est téléchargé
  if (!req.files || !req.files.image) {
    console.log(
      "imgStocker ~> PUT: /updateImage ~> status: 400 (fichier non téléchargé)"
    );
    return res.status(400).json({ message: "Aucun fichier téléchargé" });
  }

  const image = req.files.image;

  // Vérifie si le fichier est une image
  if (!authorizedMimetypes.includes(image.mimetype)) {
    console.log(
      "imgStocker ~> PUT: /updateImage ~> status: 400 (type de fichier non autorisé)"
    );
    return res.status(400).json({ message: "Type de fichier non autorisé" });
  }

  // Vérifie si le fichier dépasse 10Mo
  if (image.size > 10 * 1024 * 1024) {
    console.log(
      "imgStocker ~> PUT: /updateImage ~> status: 400 (fichier trop volumineux)"
    );
    return res
      .status(400)
      .json({ message: "Le fichier téléchargé dépasse 10Mo" });
  }

  // Vérifie si un nom de fichier est fourni dans les paramètres de requête
  const providedName = req.query.name;
  if (!providedName) {
    console.log(
      "imgStocker ~> PUT: /updateImage ~> status: 400 (aucun nom de fichier fourni)"
    );
    return res.status(400).json({ message: "Aucun nom de fichier fourni" });
  }

  // Sanitization du nom de fichier fourni
  const sanitizedFilename = path.basename(providedName);

  // Vérification de l'extension du fichier
  const fileExtension = path.extname(sanitizedFilename).toLowerCase();
  if (!authorizedExtensions.includes(fileExtension)) {
    console.log(
      "imgStocker ~> PUT: /updateImage ~> status: 400 (extension de fichier non supportée)"
    );
    return res
      .status(400)
      .json({ message: "Extension de fichier non supportée" });
  }

  // Définir le chemin de sauvegarde
  const uploadPath = path.join(process.cwd(), "images", sanitizedFilename);

  // Vérifier si le fichier existe déjà
  if (!fs.existsSync(uploadPath)) {
    console.log(
      `imgStocker ~> PUT: /updateImage ~> status: 404 (fichier '${sanitizedFilename}' non trouvé)`
    );
    return res
      .status(404)
      .json({ message: "Fichier à mettre à jour non trouvé" });
  }

  // Déplacer le nouveau fichier vers le dossier images (remplacer l'ancien)
  image.mv(uploadPath, (err) => {
    if (err) {
      console.log(
        "imgStocker ~> PUT: /updateImage ~> status: 500 (erreur lors de l'upload de l'image)"
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de l'upload de l'image" });
    }
    console.log(
      `imgStocker ~> PUT: /updateImage ~> status: 200 (image '${sanitizedFilename}' mise à jour avec succès)`
    );
    res.status(200).json({
      message: "Image mise à jour avec succès",
      filename: sanitizedFilename,
    });
  });
};
