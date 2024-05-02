const fs = require("fs-extra");
const asyncHandling = require("express-async-handler");
const { imageUpload, imageDelete } = require("../utils/cloudinary");

const uploadImage = asyncHandling(async (req, res) => {
    const uploader = (path) => imageUpload(path, "images");
    const url = [];
    const files = req.files;
    for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        console.log(newPath);
        url.push(newPath);
        fs.unlinkSync(path);
    };
});

const removeImage = asyncHandling(async (req, res) => {
    const { id } = req.params;
    const removeURL = imageDelete(id, "images");
    res.json({
        message: "File has been removed",
    });
});

module.exports = { uploadImage, removeImage };