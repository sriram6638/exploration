# Workload Identity vs Service Accounts in GCP

## What is a Service Account?
- A service account is a Google Cloud identity used by applications, VMs, or services to authenticate and access GCP resources.
- Service accounts have IAM roles and permissions.
- You can create, manage, and assign service accounts to resources (VMs, Cloud Run, GKE, etc).

## What is Workload Identity?
- Workload Identity is a GCP feature for Kubernetes (GKE) that allows pods to use Google Cloud service accounts securely.
- It maps Kubernetes service accounts to Google Cloud service accounts, so pods can access GCP resources without storing service account keys.
- This improves security and simplifies credential management.

## Key Differences
| Feature                | Service Account                | Workload Identity                |
|------------------------|-------------------------------|----------------------------------|
| Used by                | Any GCP resource/app          | GKE (Kubernetes) pods             |
| Credential type        | Key file or default identity   | No key file, uses identity mapping|
| Security               | Key file can be risky          | No key file, more secure          |
| Management             | Manual key rotation            | Automatic, no keys                |

## Why Use Workload Identity?
- Avoids storing service account keys in pods.
- Enables fine-grained IAM control for Kubernetes workloads.
- Recommended for production GKE environments.

---

# Step-by-Step: Practice Workload Identity & Service Accounts in GCP Console

## 1. Create a Service Account
- Go to **IAM & Admin > Service Accounts**.
- Click **Create Service Account**.
- Name it (e.g., `gke-app-sa`).
- Grant required IAM roles (e.g., Storage Object Viewer).

## 2. Create a GKE Cluster
- Go to **Kubernetes Engine > Clusters**.
- Click **Create Cluster**.
- Enable **Workload Identity** in cluster settings.

## 3. Create a Kubernetes Service Account
- Use Cloud Shell or local terminal:
  ```sh
  kubectl create serviceaccount k8s-app-sa
  ```

## 4. Map Kubernetes Service Account to GCP Service Account
- Run:
  ```sh
  gcloud iam service-accounts add-iam-policy-binding gke-app-sa@<PROJECT_ID>.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="serviceAccount:<PROJECT_ID>.svc.id.goog[k8s-app-namespace/k8s-app-sa]"
  ```

## 5. Annotate Kubernetes Service Account
- Run:
  ```sh
  kubectl annotate serviceaccount k8s-app-sa \
    iam.gke.io/gcp-service-account=gke-app-sa@<PROJECT_ID>.iam.gserviceaccount.com
  ```

## 6. Deploy a Pod Using the Service Account
- Example YAML:
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: app-pod
  spec:
    serviceAccountName: k8s-app-sa
    containers:
    - name: app
      image: gcr.io/<PROJECT_ID>/your-app-image
  ```

## 7. Test GCP Authentication
- Inside the pod, use Google Cloud SDK or libraries to access GCP resources.
- The pod will authenticate as the mapped GCP service account.

---

## Best Practices
- Use Workload Identity for all GKE workloads in production.
- Avoid using service account key files in pods.
- Grant only necessary IAM roles to service accounts.
- Rotate service accounts and review permissions regularly.

---

## References
- [Workload Identity Overview](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
- [Service Accounts in GCP](https://cloud.google.com/iam/docs/service-accounts)

---
This guide explains Workload Identity vs Service Accounts and provides step-by-step instructions for secure GCP authentication in production.
