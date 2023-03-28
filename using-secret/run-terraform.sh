
#!/bin/bash

# Search the secret by tags, get the secret value and store it in an environment variable
MY_SECRET_ID=$(aws secretsmanager list-secrets --query "SecretList[?Tags[?Key=='technical-name' && Value=='tf-secrets-demo'] && Tags[?Key=='environment' && Value=='dev']].{ID:ARN}" --output text)
export MY_SECRET=$(aws secretsmanager get-secret-value --secret-id "$MY_SECRET_ID" --query 'SecretString' --output text)
# Call Terraform commands with the environment variable
terraform init
terraform apply -var "MY_SECRET=$MY_SECRET"
