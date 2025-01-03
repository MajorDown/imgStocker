import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Route POST pour uploader une image envoyée dans un formData
 * @param {Request} req - Requête contenant l'image à uploader
 * @param {Response} res - Réponse à renvoyer
 */
const uploadImage = (req: Request, res: Response): void => {
    console.log("imgStocker ~> req POST /upload en cours");
    
    // Vérifier si des fichiers ont été uploadés
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("imgStocker ~> req POST /uploadImage ~> erreur : pas de fichier dans la requête");
        res.status(400).send('Aucune image dans la requête');
        return;
    }

    // Récupérer le fichier 'image'
    const imageFile = req.files.image;

    // Vérifier que 'image' est bien un fichier unique
    if (!imageFile || Array.isArray(imageFile)) {
        console.log("imgStocker ~> req POST /uploadImage ~> erreur : image non valide");
        res.status(400).send('Image non valide');
        return;
    }

    // Récupérer le nom souhaité
    const desiredName = req.body.name;
    if (!desiredName) {
        console.log("imgStocker ~> req POST /uploadImage ~> erreur : pas de nom dans la requête");
        res.status(400).send('Aucun nom dans la requête');
        return;
    }

    // Générer le chemin de sauvegarde
    const uploadPath = path.join(__dirname, '..', 'images', `${desiredName}${path.extname(imageFile.name)}`);

    // Déplacer le fichier
    imageFile.mv(uploadPath, (err: any) => {
        if (err) {
            console.error("imgStocker ~> req POST /uploadImage ~> erreur lors du déplacement du fichier:", err);
            res.status(500).send('Erreur lors du déplacement du fichier');
            return;
        }

        res.status(200).send('Image uploadée');
    });
};

export default uploadImage;
