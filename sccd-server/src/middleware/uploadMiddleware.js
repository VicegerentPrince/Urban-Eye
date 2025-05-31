const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow images and videos
  const filetypes = /jpeg|jpg|png|gif|mp4|webm|mov|avi|wmv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image|video/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50000000 }, // 50MB to accommodate videos
  fileFilter
});

module.exports = upload;