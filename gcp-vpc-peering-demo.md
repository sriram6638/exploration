# GCP VPC Peering with Sample App and Cloud Storage

This guide demonstrates a real-world scenario where two resources (e.g., a web app and a storage service) are provisioned in two different VPC networks (VNets) in Google Cloud Platform (GCP). We will set up VPC peering to enable communication between them, and deploy a sample app that uploads files to Google Cloud Storage via this peering connection.

## Table of Contents
1. Architecture Overview
2. Prerequisites
3. Step 1: Create Two VPC Networks
4. Step 2: Create Subnets in Each VPC
5. Step 3: Create VPC Peering
6. Step 4: Deploy a Sample App in VPC-1
7. Step 5: Create a Cloud Storage Bucket in VPC-2
8. Step 6: Configure Routes and Firewall Rules
9. Step 7: Test File Upload from App to Cloud Storage
10. Cleanup

---

## Architecture Overview

- **VPC-1**: Hosts a sample web app (e.g., Node.js Express app) on a Compute Engine VM.
- **VPC-2**: Hosts a Google Cloud Storage bucket.
- **VPC Peering**: Enables private communication between VPC-1 and VPC-2.

```
[User] --> [App VM in VPC-1] <--(VPC Peering)--> [Cloud Storage in VPC-2]
```

## Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Basic knowledge of GCP networking and IAM

---

## Step 1: Create Two VPC Networks

```sh
gcloud compute networks create vpc-1 --subnet-mode=custom
gcloud compute networks create vpc-2 --subnet-mode=custom
```

## Step 2: Create Subnets in Each VPC

```sh
gcloud compute networks subnets create subnet-1 \
  --network=vpc-1 --region=us-central1 --range=10.10.0.0/24

gcloud compute networks subnets create subnet-2 \
  --network=vpc-2 --region=us-central1 --range=10.20.0.0/24
```

## Step 3: Create VPC Peering

```sh
gcloud compute networks peerings create vpc-1-to-vpc-2 \
  --network=vpc-1 --peer-network=vpc-2

gcloud compute networks peerings create vpc-2-to-vpc-1 \
  --network=vpc-2 --peer-network=vpc-1
```

## Step 4: Deploy a Sample App in VPC-1

1. **Create a Compute Engine VM in VPC-1:**

```sh
gcloud compute instances create app-vm \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --subnet=subnet-1 \
  --tags=http-server,https-server \
  --image-family=debian-11 \
  --image-project=debian-cloud
```

2. **SSH into the VM and set up Node.js app:**

```sh
gcloud compute ssh app-vm --zone=us-central1-a
```

3. **Install Node.js and dependencies:**

```sh
sudo apt update && sudo apt install -y nodejs npm git
```

4. **Clone and set up the sample app:**

```sh
git clone https://github.com/GoogleCloudPlatform/nodejs-docs-samples.git
cd nodejs-docs-samples/storage/quickstart
npm install
```

5. **Set up authentication (Service Account with Storage permissions):**
- Create a service account with `Storage Object Admin` role.
- Download the JSON key and upload it to the VM.
- Set the environment variable:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

---

## Step 5: Create a Cloud Storage Bucket in VPC-2

```sh
gsutil mb -p <YOUR_PROJECT_ID> -c standard -l us-central1 gs://<YOUR_BUCKET_NAME>
```

---

## Step 6: Configure Routes and Firewall Rules

- Ensure both VPCs have routes to each other's subnets (should be automatic with peering).
- Allow necessary firewall rules for HTTP/HTTPS and internal traffic.

```sh
gcloud compute firewall-rules create allow-internal-vpc-1 \
  --network=vpc-1 --allow tcp,udp,icmp --source-ranges=10.10.0.0/24,10.20.0.0/24

gcloud compute firewall-rules create allow-internal-vpc-2 \
  --network=vpc-2 --allow tcp,udp,icmp --source-ranges=10.10.0.0/24,10.20.0.0/24
```

---

## Step 7: Test File Upload from App to Cloud Storage

1. **Edit the sample app to use your bucket name.**
2. **Run the app and upload a file:**

```sh
node uploadFile.js <YOUR_BUCKET_NAME> <LOCAL_FILE_PATH>
```

3. **Verify the file in Cloud Storage:**

```sh
gsutil ls gs://<YOUR_BUCKET_NAME>
```

---

## Cleanup

To avoid charges, delete the resources:

```sh
gcloud compute instances delete app-vm --zone=us-central1-a
gcloud compute networks peerings delete vpc-1-to-vpc-2 --network=vpc-1
gcloud compute networks peerings delete vpc-2-to-vpc-1 --network=vpc-2
gcloud compute networks delete vpc-1
gcloud compute networks delete vpc-2
gsutil rm -r gs://<YOUR_BUCKET_NAME>
```

---

## References
- [VPC Network Peering Overview](https://cloud.google.com/vpc/docs/vpc-peering)
- [Node.js Cloud Storage Quickstart](https://cloud.google.com/nodejs/docs/reference/storage/latest)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs/)

---

**This guide provides a real, hands-on scenario for GCP VPC peering and app-to-storage communication.**
