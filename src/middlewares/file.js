const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Angular-app-practica',
        allowedFormats: ["jpg", "png", 'jpeg', 'gif']
    }
})

const upload = multer({ storage });

module.exports = upload;

