# AWS Secrets Management with Terraform

## Why You Should Avoid Using random_password and How to Implement a Secure Alternative

This is the repository for the official tecRacer blog post [Enhancing Security in Terraform with AWS Secrets Manager](). With the code here you can create or use the secrets secure without saving them into the Terraform state.

The repository contains two folders:

- creating-secret
- using-secret

In the first one you will find the code to create an AWS secret, the second one contains the code to retrieve.


## Try it yourself

### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- An AWS Account

### Setup

1. Clone the repo, change to the **creating-secret** folder
2. Run `terraform init` to initialize the Terraform environment
3. Run `terraform plan` and `terraform apply` to deploy the code
4. Change to the **using-secret** folder, change the main.tf as needed and run the bash script to deploy the terraform code and to retrieve the secret. 

### Teardown

Run `terraform destroy` to remove the infrastructure.
