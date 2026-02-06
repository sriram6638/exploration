# GCP VPC Peering Demo: Full Walkthrough & Code Explanation

This document provides a clear, step-by-step guide for deploying a Node.js app to Cloud Run using Docker and Artifact Registry, with VPC peering and Cloud Storage access. Each section is segregated for clarity, including code explanations and necessary files in the repo.

---

## 1. Project Structure

```
/ (repo root)
├── app.js                # Main Node.js application
├── package.json          # Node.js dependencies and scripts
├── Dockerfile            # Docker build instructions
├── gcp-vpc-peering-demo.md  # (This guide)
└── ...                   # Other files
```

---

## 2. Application Code: `app.js`

```js
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Set your bucket name here
const BUCKET_NAME = process.env.BUCKET_NAME || 'your-bucket-name';
// Path to service account key file
const KEYFILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/app/key.json';

const storage = new Storage({ keyFilename: KEYFILE });

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
```

**Explanation:**
- Uses Express for a simple web server.
- Uses Multer for file uploads.
- Uses `@google-cloud/storage` to upload files to a GCS bucket.
- The bucket name and service account key are set via environment variables.

---

## 3. Dependencies: `package.json`

```json
{
  "name": "gcp-vpc-peering-demo-app",
  "version": "1.0.0",
  "description": "Sample app for GCP VPC peering and Cloud Storage access",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@google-cloud/storage": "^7.19.0",
    "multer": "^1.4.4"
  }
}
```

**Explanation:**
- Lists all required dependencies for the app to run.

---

## 4. Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "app.js"]
```

**Explanation:**
- Uses a lightweight Node.js image.
- Installs only production dependencies.
- Exposes port 8080 for the app.

---

## 5. Build & Push Docker Image

**Build locally:**
```sh
docker build -t gcp-vpc-peering-demo-app .
```

**Tag for Artifact Registry:**
```sh
docker tag gcp-vpc-peering-demo-app asia-south1-docker.pkg.dev/prime-service-485604-a2/testing-app/gcp-vpc-peering-demo-app:latest
```

**Authenticate Docker:**
```sh
gcloud auth configure-docker asia-south1-docker.pkg.dev
```

**Push to Artifact Registry:**
```sh
docker push asia-south1-docker.pkg.dev/prime-service-485604-a2/testing-app/gcp-vpc-peering-demo-app:latest
```

---

## 6. Deploy to Cloud Run (GCP Console)
- Go to **Cloud Run > Create Service**
- Select the pushed image from Artifact Registry
- Set region, service name, and VPC connector (for VPC-1)
- Set environment variables: `BUCKET_NAME`, `GOOGLE_APPLICATION_CREDENTIALS`
- Deploy

---

## 7. VPC Peering & Storage Access
- Ensure VPC peering is set up between VPC-1 (Cloud Run) and VPC-2 (Cloud Storage bucket)
- Grant the Cloud Run service account `Storage Object Admin` role on the bucket

---

## 8. Test the Application
- Open the Cloud Run service URL
- Upload a file using the web form
- Verify the file appears in the Cloud Storage bucket

---

## 9. Additional Files
- `.gitignore` (optional):
  ```
  node_modules
  uploads
  *.log
  key.json
  ```
- `key.json`: Service account key file (should not be committed to git)

---

## 10. Cleanup
- Delete Cloud Run service, Artifact Registry image, VPCs, and Cloud Storage bucket to avoid charges

---

**This guide provides a clear, segregated explanation of every step, code, and file needed for the GCP VPC peering demo.**
