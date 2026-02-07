const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Set your bucket name here
const BUCKET_NAME = process.env.BUCKET_NAME || 'your-bucket-name';
// For Cloud Run, use default credentials. For local/dev, allow credentials object via env var.
let storage;
if (process.env.GCLOUD_CREDENTIALS_JSON) {
  // Parse credentials from env var (not recommended for prod)
  const credentials = JSON.parse(process.env.GCLOUD_CREDENTIALS_JSON);
  storage = new Storage({ credentials });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Use key file path if provided
  storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
} else {
  // Use default credentials (Cloud Run, GCE, etc.)
  storage = new Storage();
}

app.get('/', (req, res) => {
  res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file" /><button type="submit">Upload</button></form>');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  const blob = storage.bucket(BUCKET_NAME).file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => res.status(500).send(err.message));
  blobStream.on('finish', () => res.send('File uploaded to Cloud Storage!'));

  blobStream.end(require('fs').readFileSync(req.file.path));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
