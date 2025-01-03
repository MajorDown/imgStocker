import path from "path";
import fs from "fs";

/**
 * @description Télécharge une image dans le dossier images
 * @param {Object} req Requête HTTP
 * @param {Object} res Réponse HTTP
 * @returns {Object} Réponse HTTP
 */
export const postImage = (req, res) => {
  // Vérifie si un fichier est téléchargé
  if (!req.files || !req.files.image) {
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 400 (fichier non téléchargé)"
    );
    return res.status(400).json({ message: "Aucun fichier téléchargé" });
  }
  const image = req.files.image;

  // Vérifie si le fichier est une image
  const authorizedExtensions = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  if (!authorizedExtensions.includes(image.mimetype)) {
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 400 (type de fichier non autorisé)"
    );
    return res.status(400).json({ message: "Type de fichier non autorisé" });
  }

  // Vérifie si le fichier dépasse 10Mo
  if (image.size > 10 * 1024 * 1024) {
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 400 (fichier trop volumineux)"
    );
    return res
      .status(400)
      .json({ message: "Le fichier téléchargé dépasse 10Mo" });
  }

  // Vérifie si un nom de fichier est fourni dans les paramètres de requête
  const providedName = req.query.name;
  if (!providedName) {
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 400 (aucun nom de fichier fourni)"
    );
    return res.status(400).json({ message: "Aucun nom de fichier fourni" });
  }

  // Sanitization du nom de fichier fourni
  const sanitizedFilename = path.basename(providedName);

  // Définir le chemin de sauvegarde
  const uploadPath = path.join(process.cwd(), "images", sanitizedFilename);

  // Vérifier si le fichier existe déjà
  if (fs.existsSync(uploadPath)) {
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 409 (fichier déjà existant)"
    );
    return res.status(409).json({ message: "Le fichier existe déjà" });
  }

  // Déplacer le fichier téléchargé vers le dossier images
  image.mv(uploadPath, (err) => {
    if (err) {
      console.log(
        "imgStocker ~> POST: /postImage ~> status: 500 (erreur lors de l'upload de l'image)"
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de l'upload de l'image" });
    }
    console.log(
      "imgStocker ~> POST: /postImage ~> status: 200 (image téléchargée avec succès)"
    );
    res.status(200).json({
      message: "Image téléchargée avec succès",
      filename: uniqueFilename,
    });
  });
};
