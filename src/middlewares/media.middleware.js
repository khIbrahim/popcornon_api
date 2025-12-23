import multer from "multer";
import path from "path";

export function parseMedia(req, res, next) {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/cinemas/');
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    })

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
    }).fields([
        { name: 'photo', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: "Erreur lors du téléchargement des fichiers",
                error: err.message,
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
                error: err.message,
            });
        }


        req.photo = req.files?.photo?.[0]?.path ?? null;
        req.cover = req.files?.cover?.[0]?.path ?? null;
        next();
    });
}

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];

    if(! allowed.includes(file.mimetype)){
        cb(new Error("Type de fichier non supporté, doit être 'jpeg' ou 'png'"));
        return;
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (! ['.jpg', '.jpeg', '.png'].includes(ext)) {
        return cb(new Error("Extension non valide"));
    }

    cb(null, true);
}