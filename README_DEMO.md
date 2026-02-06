## Complete CI/CD Stages in GCP Cloud Build

Here’s what happens in a typical production-ready CI/CD pipeline after a successful build:

### 1. Source Code Commit
- Developer pushes code to the repository (GitHub, GitLab, or Cloud Source Repositories).

### 2. Trigger Activation
- Cloud Build trigger detects the commit (based on branch or tag rules).

### 3. Build Stage
- Cloud Build runs the steps in `cloudbuild.yaml`:
	- Installs dependencies
	- Runs tests (if configured)
	- Builds the Docker image

### 4. Artifact Storage
- The built Docker image is pushed to Artifact Registry (secure container image storage).

### 5. Deployment Stage
- Cloud Build deploys the new image to Cloud Run (or App Engine, GKE, etc.).
- The service is updated with the new version.

### 6. Verification & Monitoring
- Cloud Run provides a new revision and URL for the deployed service.
- You can test the live service.
- Cloud Monitoring and Logging track health, errors, and performance.

### 7. Rollback (if needed)
- If issues are found, you can roll back to a previous revision in Cloud Run.

### 8. Notification (optional)
- Cloud Build can be configured to send notifications (Slack, email, etc.) on build/deploy status.

---
**Summary:**
1. Code pushed → 2. Trigger fires → 3. Build & test → 4. Image stored → 5. Deploy → 6. Monitor → 7. Rollback if needed → 8. Notify team

This is a full CI/CD loop for modern cloud-native applications on GCP.

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
