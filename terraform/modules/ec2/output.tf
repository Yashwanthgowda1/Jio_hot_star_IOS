output "ami_id" {
  value = aws_instance.public_app.ami
}
output "instence_type" {
  value = aws_instance.public_app.instance_type
}

output "instence_state" {
  value = aws_instance.public_app.instance_state
}

output "instance_ips" {
  value = aws_instance.public_app.public_ip
}
