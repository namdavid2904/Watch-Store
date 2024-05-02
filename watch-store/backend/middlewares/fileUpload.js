const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// storage
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
    }
});

// filter - checking file type
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({message: 'Unsupported file type'}, false);
    }
};

const uploadFile = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fieldSize: 1000000},
});

const productImageEdit = async (req, res, next) => {
    if (!req.files) {
        return next();
    };
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/products/${file.filename}`);
            fs.unlinkSync(`public/images/products/${file.filename}`);
        })
    );
    next();
};


module.exports = { uploadFile, productImageEdit };