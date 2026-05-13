const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4040;

// =========================
// CREATE UPLOAD FOLDERS
// =========================
const imageDir = path.join(__dirname, 'uploads/images');
const audioDir = path.join(__dirname, 'uploads/audios');

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// =========================
// IMAGE STORAGE
// =========================
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const imageUpload = multer({ storage: imageStorage });

// =========================
// AUDIO STORAGE
// =========================
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const audioUpload = multer({ storage: audioStorage });

// =========================
// STATIC FILES
// =========================
app.use('/images', express.static(imageDir));
app.use('/audios', express.static(audioDir));

// =========================
// UPLOAD IMAGE API
// =========================
app.post('/upload/image', imageUpload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:${PORT}/images/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

// =========================
// UPLOAD AUDIO API
// =========================
app.post('/upload/audio', audioUpload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:${PORT}/audios/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

// =========================
// SERVER START
// =========================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});