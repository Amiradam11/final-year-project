const multer = require("multer");
// const { pdfjs } = require('pdfjs-dist');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;