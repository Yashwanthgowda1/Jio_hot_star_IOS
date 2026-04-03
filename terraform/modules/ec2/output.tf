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

output "instance_profile" {
  value = aws_instance.public_app.iam_instance_profile
  
}
output "instance_tagnecy" {
  value = aws_instance.public_app.tags
}

output "instance" {
  value = aws_instance.public_app
  
}

output "instances" {
  value = {
    var.selected_env = [
      for inst in aws_instance.public_app : {
        public_ip = inst.public_ip
      }
    ]
  }
}