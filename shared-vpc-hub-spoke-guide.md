# Google Cloud Shared VPC & Hub-Spoke Network Guide

## 1. What is Shared VPC?
Shared VPC lets you centrally manage network resources (subnets, firewalls, routes) in a host project, and share them with service projects. This enables secure, scalable, and centralized networking for multiple projects.

- **Host Project:** Owns the VPC network and subnets.
- **Service Project:** Uses the shared subnets/resources from the host project.

## 2. Hub-Spoke Network Architecture
- **Hub:** The central VPC (host project) with shared subnets and network services (firewall, NAT, etc).
- **Spoke:** Service projects connected to the hub, using shared subnets.
- **Peering:** Spokes can communicate with the hub, but not directly with each other (unless configured).

## 3. Benefits
- Centralized control of network/security.
- Simplified management for large organizations.
- Isolation between service projects.

## 4. Implementation Steps

### Step 1: Create Host Project & VPC
- Create a GCP project (host).
- Create a VPC network in the host project.
- Create subnets as needed.

### Step 2: Enable Shared VPC
- In the host project, enable Shared VPC.
- Add service projects to the host project.

### Step 3: Attach Service Projects
- In the host project, grant `Shared VPC Admin` and `Network User` roles to service project users.
- In service projects, deploy resources (VMs, Cloud Run, etc) using shared subnets.

### Step 4: Hub-Spoke Topology
- The host project is the hub.
- Each service project is a spoke.
- Use firewall rules, routes, and VPC Service Controls for security.

### Step 5: Test Connectivity
- Deploy a VM or service in a service project.
- Confirm it uses the shared subnet from the host project.
- Test communication with hub resources.

## 5. Example Diagram

```
[Host Project: Hub]
  |
  |-- Shared VPC Network
  |     |-- Subnet A
  |     |-- Subnet B
  |
  |-- Service Project 1 (Spoke)
  |     |-- VM/Service using Subnet A
  |
  |-- Service Project 2 (Spoke)
        |-- VM/Service using Subnet B
```

## 6. Useful Commands

### Enable Shared VPC:
gcloud compute shared-vpc enable <HOST_PROJECT_ID>

gcloud compute shared-vpc associated-projects add <HOST_PROJECT_ID> --project=<SERVICE_PROJECT_ID>

### Grant Roles:
gcloud projects add-iam-policy-binding <HOST_PROJECT_ID> --member="user:<USER_EMAIL>" --role="roles/compute.networkUser"

gcloud projects add-iam-policy-binding <HOST_PROJECT_ID> --member="user:<USER_EMAIL>" --role="roles/compute.sharedVpcAdmin"

## 7. Security & Best Practices
- Use firewall rules to control traffic.
- Use VPC Service Controls for data exfiltration protection.
- Limit IAM permissions for service projects.
- Monitor network traffic and logs.

## 8. References
- [Google Cloud Shared VPC Documentation](https://cloud.google.com/vpc/docs/shared-vpc)
- [Hub-and-Spoke Network Topology](https://cloud.google.com/architecture/hub-and-spoke-network-topology)

---
This guide covers the essentials for understanding and implementing Shared VPC and hub-spoke architecture in Google Cloud. Adjust steps as needed for your organization.
