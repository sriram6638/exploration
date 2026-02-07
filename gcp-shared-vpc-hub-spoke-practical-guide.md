# Practical Guide: Implementing Shared VPC & Hub-Spoke Architecture in GCP Console

## Overview
This guide provides step-by-step instructions to set up Shared VPC (hub-spoke) in Google Cloud Platform using the Console, including resource communication and flow.

---

## 1. Create Host Project (Hub)
- Go to **IAM & Admin > Create Project**.
- Name it (e.g., `network-hub`).

## 2. Create Service Projects (Spokes)
- Create additional projects for your applications (e.g., `app-spoke-1`, `app-spoke-2`).

## 3. Set Up VPC in Host Project
- Go to **VPC Network > Create VPC network**.
- Add subnets (e.g., `subnet-a`, `subnet-b`) in desired regions.

## 4. Enable Shared VPC
- In Host Project, go to **Shared VPC > Enable Shared VPC**.
- Add your service projects as "Service Projects".

## 5. Grant Roles
- In Host Project, go to **IAM > Grant Roles**.
- Grant `Network User` role to service project users/groups.
- Optionally, grant `Shared VPC Admin` for advanced control.

## 6. Attach Service Projects
- In Host Project, **Shared VPC > Service Projects > Add** your service projects.

## 7. Deploy Resources in Service Projects
- Go to Compute Engine, Cloud Run, or other services in a service project.
- When creating a VM or service, select the shared subnet from the host project.

## 8. Configure Firewall Rules
- In Host Project, **VPC Network > Firewall rules**.
- Add rules to allow communication between hub and spokes as needed.

## 9. Test Communication
- Deploy a VM in a spoke project using the shared subnet.
- Deploy a VM or service in the hub project.
- Use internal IPs to ping or connect between resources.

## 10. Monitor & Secure
- Use **VPC Service Controls** for data exfiltration protection.
- Monitor traffic in **VPC Network > Flow Logs**.

---

## Resource Communication & Flow
- **Hub (host project):** Manages network, subnets, and firewall.
- **Spoke (service projects):** Deploy resources using shared subnets.
- **Communication:** All resources communicate via internal IPs within the shared VPC.
- **Firewall:** Rules control allowed traffic.

---

## Example Diagram
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

---

## Useful Links
- [Google Cloud Shared VPC Documentation](https://cloud.google.com/vpc/docs/shared-vpc)
- [Hub-and-Spoke Network Topology](https://cloud.google.com/architecture/hub-and-spoke-network-topology)

---

This guide helps you implement and test Shared VPC and hub-spoke architecture in GCP Console. Adjust steps as needed for your environment.
