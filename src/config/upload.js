const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Set up storage configuration (local storage example)
// Define the path for the 'uploads' folder
// const uploadDir = path.join(__dirname, 'uploads');
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure the 'uploads' folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // Create the folder if it doesn't exist
  console.log('Uploads folder created!');
} else {
  console.log('Uploads folder already exists.');
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the 'uploads' directory as the destination
  },
  filename: (req, file, cb) => {
    // Generate a unique file name
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit size to 5 MB per file
  fileFilter: (req, file, cb) => {
    // Check if file type is an image (you can adjust to other types if needed)
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  },
}).array('images', 5); // Maximum of 5 images

module.exports = upload;