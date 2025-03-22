const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/fichiers');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const numCourrier = req.body.num_courrier;
        const basename = path.basename(file.originalname, extension);


        if (numCourrier) {
            cb(null, `${numCourrier}_${basename}${extension}`);
        } else {
            cb(new Error('Le numéro de courrier est manquant'), false);
        }
    }
});

const upload = multer({ storage: storage });


module.exports = upload;

