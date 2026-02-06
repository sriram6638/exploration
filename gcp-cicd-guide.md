# GCP DevOps: Production-Ready CI/CD with Cloud Build

This guide will walk you through setting up a production-level CI/CD pipeline on Google Cloud Platform (GCP) using Cloud Build. It is designed for beginners and covers every step, from project setup to automated deployment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Source Code Management](#source-code-management)
4. [Cloud Build Setup](#cloud-build-setup)
5. [Build Triggers](#build-triggers)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Monitoring & Rollback](#monitoring--rollback)
9. [Best Practices](#best-practices)
10. [References](#references)

---

## 1. Prerequisites
- Google Cloud account ([signup](https://cloud.google.com/))
- Billing enabled
- Basic knowledge of Git
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed

## 2. Project Setup
### A. Using GCP Console (UI)
1. **Create a GCP Project:**
  - Go to [GCP Console](https://console.cloud.google.com/)
  - Click the project dropdown (top left) > **New Project**
  - Enter a project name, select an organization (if any), and click **Create**
  - After creation, select your new project from the dropdown
2. **Enable Billing:**
  - In the left menu, go to **Billing**
  - Link a billing account to your project (follow prompts)
3. **Enable Required APIs:**
  - In the left menu, go to **APIs & Services > Library**
  - Search for and enable:
    - Cloud Build API
    - Artifact Registry API
    - Cloud Run API (or App Engine/Compute Engine as needed)

### B. Using CLI
1. Create project and set it as default:
  ```sh
  gcloud projects create PROJECT_ID
  gcloud config set project PROJECT_ID
  ```
2. Enable billing and APIs:
  ```sh
  gcloud services enable cloudbuild.googleapis.com artifactregistry.googleapis.com run.googleapis.com
  ```

## 3. Source Code Management
### A. Using GCP Console (UI)
- Go to **Source Repositories** in the GCP Console (or use GitHub/GitLab)
- Click **Add Repository** to create a new repo or connect an external repo
- Follow prompts to push your code or connect your GitHub/GitLab account

### B. Using CLI
- Use `git` commands to push your code to your chosen repository

## 4. Cloud Build Setup
### A. Using GCP Console (UI)
1. **Create Artifact Registry Repository:**
   - Go to **Artifact Registry** in the GCP Console
   - Click **Create Repository**
   - Choose Docker, set a name, select a region, and click **Create**
2. **Create `cloudbuild.yaml`:**
   - In your code editor, add a `cloudbuild.yaml` file to your repo root (see below for sample)
   - Commit and push this file to your repository
3. **Connect Cloud Build to your repo:**
   - Go to **Cloud Build > Triggers**
   - Click **Create Trigger**
   - Select your repository and branch, and specify `cloudbuild.yaml` as the build config file

### B. Using CLI
1. Create Artifact Registry repository:
   ```sh
   gcloud artifacts repositories create REPO --repository-format=docker --location=REGION
   ```
2. Add `cloudbuild.yaml` to your repo as shown below:
   ```yaml
   steps:
     - name: 'gcr.io/cloud-builders/docker'
       args: ['build', '-t', 'REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE:TAG', '.']
     - name: 'gcr.io/cloud-builders/docker'
       args: ['push', 'REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE:TAG']
     - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
       entrypoint: gcloud
       args: ['run', 'deploy', 'SERVICE_NAME', '--image', 'REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE:TAG', '--region', 'REGION', '--platform', 'managed', '--allow-unauthenticated']
   images:
     - 'REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE:TAG'
   ```

## 5. Build Triggers
### A. Using GCP Console (UI)
- Go to **Cloud Build > Triggers**
- Click **Create Trigger**
- Select your repository (GitHub, GitLab, or Cloud Source Repositories)
- Set the trigger event (e.g., push to main branch)
- Specify the build config file (`cloudbuild.yaml`)
- Click **Create**

### B. Using CLI
- Use `gcloud beta builds triggers create ...` (see [Cloud Build docs](https://cloud.google.com/build/docs/automating-builds/create-manage-triggers))

## 6. Testing
### A. Using GCP Console (UI)
- In your `cloudbuild.yaml`, add test steps before build/deploy (see below)
- When a build runs (triggered by a commit), you can view logs in **Cloud Build > History**
- If tests fail, the build will be marked as failed

### B. Using CLI
- Add test steps in `cloudbuild.yaml` before build/deploy:
  ```yaml
  - name: 'gcr.io/cloud-builders/npm'
    args: ['test']
  ```

## 7. Deployment
### A. Using GCP Console (UI)
- Go to **Cloud Run** (or App Engine/Compute Engine as needed)
- Click **Create Service**
- Select the container image from Artifact Registry
- Configure service settings (region, authentication, etc.)
- Click **Deploy**

### B. Using CLI
- Deploy to Cloud Run:
  ```sh
  gcloud run deploy SERVICE_NAME --image REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE:TAG --region REGION --platform managed --allow-unauthenticated
  ```

## 8. Monitoring & Rollback
### A. Using GCP Console (UI)
- Go to **Cloud Build > History** to view build logs and status
- Go to **Cloud Run > Service > Revisions** to view and manage deployments
- Use **Cloud Monitoring** and **Cloud Logging** for metrics and logs
- To rollback, select a previous revision in Cloud Run and click **Roll back to this revision**

### B. Using CLI
- Use `gcloud` commands to view logs and redeploy previous images

## 9. Best Practices
- Use separate environments (dev, staging, prod) via different projects or services
- Store secrets in **Secret Manager** (Console: Security > Secret Manager)
- Use IAM roles for least privilege (Console: IAM & Admin)
- Automate tests and security scans in `cloudbuild.yaml`
- Monitor costs and set budgets (Console: Billing > Budgets & alerts)

## 10. References
- [GCP Cloud Build Docs](https://cloud.google.com/build/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Artifact Registry Docs](https://cloud.google.com/artifact-registry/docs)

---

**This guide provides a practical, step-by-step approach to setting up CI/CD on GCP for production.**
