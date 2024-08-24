const multer = require("multer");
const { v4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./files");
  },
  filename: (req, file, callback) => {
    callback(null, v4() + "--" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = {upload}