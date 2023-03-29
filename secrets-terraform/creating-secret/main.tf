provider "aws" {
  region = "eu-central-1"
}

variable "master_user_name" {
  description = "The variable for the user name"
  default     = "user"
}

resource "aws_secretsmanager_secret" "this" {
  name_prefix = "/AwesomeApp/UserPassword"
  tags = {
    owner          = "tecracer"
    environment    = "dev"
    technical-name = "tf-secrets-demo"
  }
}

resource "terraform_data" "create_secret_version" {
  triggers_replace = [
    aws_secretsmanager_secret.this.id
  ]
  provisioner "local-exec" {
    command     = <<-EOT
      # Generate a random 16-character base64-encoded password
      PASSWORD=$(openssl rand -base64 16)
      # Create a JSON object with username and password
      SECRET_JSON=$(echo '{"username": "${var.master_user_name}", "password": "'$PASSWORD'" }')
      # Store the JSON object in AWS Secrets Manager
      aws secretsmanager put-secret-value \
        --secret-id ${aws_secretsmanager_secret.this.id} \
        --secret-string "$SECRET_JSON"
    EOT
    interpreter = ["/bin/sh", "-c"]
  }
  depends_on = [aws_secretsmanager_secret.this]
}
