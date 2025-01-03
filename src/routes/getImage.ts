// src/routes/getImage.ts
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Fonction pour récupérer une image stockée portant le nom indiqué en paramètre (/getImage/:imageName)
const getImage = (req: Request, res: Response): void => {
    console.log("imgStocker ~> req GET /getImage en cours");

    // Récupérer le nom de l'image sans extension
    const imageName = req.params.imageName;

    // Extensions autorisées
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    // Dossier où les images sont stockées
    const uploadsDir = path.join(__dirname, '..', 'images');

    // Fonction pour vérifier et envoyer l'image
    const sendImage = (filePath: string) => {
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`imgStocker ~> req GET /getImage ~> erreur lors de l'envoi du fichier: ${err}`);
                res.status(500).send('Erreur lors de l\'envoi de l\'image');
            }
        });
    };

    // Parcourir les extensions autorisées pour trouver le fichier
    for (const ext of allowedExtensions) {
        const filePath = path.join(uploadsDir, `${imageName}${ext}`);
        if (fs.existsSync(filePath)) {
            console.log(`imgStocker ~> req GET /getImage ~> image trouvée: ${imageName}${ext}`);
            sendImage(filePath);
            return;
        }
    }

    // Si aucun fichier n'est trouvé
    console.log("imgStocker ~> req GET /getImage ~> erreur : image non trouvée");
    res.status(404).send('Image non trouvée');
};

export default getImage;
