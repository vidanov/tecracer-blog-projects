variable "MY_SECRET" {
  description = "The variable for the user name and passw"
}
locals {
  username = jsondecode(var.MY_SECRET).username
  password = jsondecode(var.MY_SECRET).password
}

# Then you can use the locals in your code by referring them like this:
# local.username
# local.password
# The output is only for the demonstration purpose

output "username" {
  value = local.username
}
