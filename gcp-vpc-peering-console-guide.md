# GCP Console Step-by-Step Guide: Deploying Docker App with VPC Peering & Cloud Storage

This guide walks you through deploying a sample Node.js app in Cloud Run, using Docker, Artifact Registry, VPC peering, and accessing a Cloud Storage bucket in another VPC—all via the GCP Console UI.

---

## 1. Create Two VPC Networks

**GCP Console Steps:**
- Go to **VPC network > VPC networks**.
- Click **Create VPC network**.
- Name: `vpc-1`, Subnet mode: Custom.
- Add subnet: Name `subnet-1`, Region `us-central1`, IP range `10.10.0.0/24`.
- Click **Create**.
- Repeat for `vpc-2` with subnet `subnet-2`, IP range `10.20.0.0/24`.

---

## 2. Create VPC Peering

**GCP Console Steps:**
- Go to **VPC network > VPC network peering**.
- Click **Create Peering**.
- Name: `vpc-1-to-vpc-2`, Select `vpc-1` as network, Peer network: `vpc-2`.
- Click **Create**.
- Repeat for `vpc-2-to-vpc-1`.

---

## 3. Create a Cloud Storage Bucket in VPC-2

**GCP Console Steps:**
- Go to **Storage > Buckets**.
- Click **Create**.
- Name: `your-bucket-name`, Location: `us-central1`.
- Click **Create**.

---

## 4. Create Artifact Registry Repository

**GCP Console Steps:**
- Go to **Artifact Registry > Repositories**.
- Click **Create repository**.
- Name: `demo-repo`, Format: Docker, Location: `us-central1`.
- Click **Create**.

---

## 5. Build & Push Docker Image

**Local Steps:**
- Build image:
  ```sh
  docker build -t us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/demo-repo/gcp-vpc-peering-demo-app:latest .
  ```
- Authenticate:
  ```sh
  gcloud auth configure-docker us-central1-docker.pkg.dev
  ```
- Push image:
  ```sh
  docker push us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/demo-repo/gcp-vpc-peering-demo-app:latest
  ```

---

## 6. Deploy to Cloud Run

**GCP Console Steps:**
- Go to **Cloud Run > Services**.
- Click **Create Service**.
- Name: `demo-app`, Region: `us-central1`.
- Select **Container image**: `us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/demo-repo/gcp-vpc-peering-demo-app:latest`.
- Set **VPC Connector**: Create/select connector for `vpc-1`.
- Click **Create**.

---

## 7. Grant Service Account Access to Cloud Storage

**GCP Console Steps:**
- Go to **IAM & Admin > Service Accounts**.
- Find Cloud Run service account.
- Click **Edit** > **Add Role**: `Storage Object Admin`.
- Save.

---

## 8. Configure Firewall Rules

**GCP Console Steps:**
- Go to **VPC network > Firewall rules**.
- Click **Create Firewall Rule**.
- Name: `allow-internal-vpc-1`, Network: `vpc-1`, Source: `10.10.0.0/24,10.20.0.0/24`, Protocols: TCP, UDP, ICMP.
- Click **Create**.
- Repeat for `vpc-2`.

---

## 9. Test App Upload to Cloud Storage

- Open Cloud Run app URL.
- Upload a file using the web form.
- Check Cloud Storage bucket for the uploaded file.

---

## 10. Cleanup

**GCP Console Steps:**
- Delete Cloud Run service, Artifact Registry repo, VPC networks, peering, and Cloud Storage bucket to avoid charges.

---

**References:**
- [VPC Peering in GCP Console](https://cloud.google.com/vpc/docs/using-vpc-peering)
- [Cloud Run Deployment](https://cloud.google.com/run/docs/deploying)
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs/docker)
- [Cloud Storage](https://cloud.google.com/storage/docs/creating-buckets)

---

This guide provides every step in the GCP Console UI for deploying a Docker app with VPC peering and Cloud Storage access across VPCs.
