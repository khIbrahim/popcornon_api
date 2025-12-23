import multer from 'multer';

class MediaService {

    getCinemaStorage() {
        const storage = multer.storage({
            destination: function(req, file, cb) {
                cb(null, 'uploads/cinemas/');
            },
            filename: function(req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + '-' + file.originalname);
            }
        });

        return multer({storage: storage}).fields([
            {name: 'photo', maxCount: 1},
            {name: 'coverPhoto', maxCount: 1}
        ]);
    }

    processImages(req) {
        const images = {};
        if (req.files['photo'] && req.files['photo'][0]) {
            images.photo = req.files['photo'][0].path;
        }
        if (req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
            images.coverPhoto = req.files['coverPhoto'][0].path;
        }
        return images;
    }
}

export default new MediaService();