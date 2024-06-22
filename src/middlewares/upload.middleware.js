const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    destinationFolder = "";
    if (req.originalUrl.includes("documents")) {
      destinationFolder = "documents";
    }

    if (req.originalUrl.includes("profile-picture")) {
      destinationFolder = "profiles";
    }

    cb(null, `${__dirname}/../public/files/${destinationFolder}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
