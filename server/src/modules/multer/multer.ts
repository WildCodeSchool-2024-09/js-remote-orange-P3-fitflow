import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

type User = {
    user: any;
    id: number;
    user_role: string;
}

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

const uploadDir = path.join(__dirname, '../../../../public/imageUpload');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    }, 
    filename: (req, file, callback) => {
        const userData: User = req.user as unknown as User;
        const userId = userData.user.id;
        // Remplacer les espaces par des underscores dans le nom du fichier
        const name = file.originalname.split(' ').join('_');
        // Définir l'extension du fichier en fonction du type MIME
        const extension = MIME_TYPES[file.mimetype as keyof typeof MIME_TYPES];
        // Générer un nom de fichier unique en ajoutant l'id de l'utilisateur
        callback(null, name + userId + '.' + extension);
    }
});

const imageUpload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }}); // 5MB

const fileUpload = imageUpload.single('file');

export { fileUpload };