const multer = require("multer");
// const { pdfjs } = require('pdfjs-dist');

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;