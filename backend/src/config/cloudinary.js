const cloudinary = require('cloudinary').v2
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Stockage en mémoire (pas sur disque)
const upload = multer({ storage: multer.memoryStorage() })

// Fonction pour uploader vers Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'vite-gourmand',
        transformation: [{ width: 800, height: 600, crop: 'fill' }]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

module.exports = { cloudinary, upload, uploadToCloudinary }