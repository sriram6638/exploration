
# Sample Node.js App for GCP Cloud Build Demo

This is a simple Node.js application to demonstrate CI/CD with Google Cloud Build.

## Project Files Explained

### 1. `index.js`
The main Node.js application file. It starts a basic HTTP server that responds with a greeting message.

### 2. `package.json`
Defines the Node.js project, dependencies, and scripts. Used by npm to install and run the app.

### 3. `Dockerfile`
Describes how to build a Docker image for the app:
- Uses Node.js 18 Alpine as the base image
- Installs dependencies
- Copies app code
- Exposes port 8080
- Starts the app with `npm start`

### 4. `cloudbuild.yaml`
Google Cloud Build configuration file. It defines the CI/CD pipeline steps:
- Build the Docker image
- Push the image to Google Artifact Registry
- Deploy the image to Cloud Run
- Uses variables for project, repo, image, and service names

## Local Build & Run

### Build Docker Image Locally
```
docker build -t gcp-cicd-demo:local .
```

### Run the Container Locally
```
docker run -p 8080:8080 gcp-cicd-demo:local
```
Visit http://localhost:8080 to see the app running.

## Cloud Build CI/CD

When you push code to your repository and trigger Cloud Build:
1. The pipeline builds and pushes the Docker image
2. Deploys the image to Cloud Run
3. You get a live, auto-updated service URL

---
This setup is ready for demo and learning purposes. You can extend it with tests, environment variables, and more advanced CI/CD steps as needed.
