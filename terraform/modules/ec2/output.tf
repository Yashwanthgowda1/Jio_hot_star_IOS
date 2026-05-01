output "ami_id" {
  value = { for k, inst in aws_instance.public_app : k => inst.ami }
}

output "instence_type" {
  value = { for k, inst in aws_instance.public_app : k => inst.instance_type }
}

output "instence_state" {
  value = { for k, inst in aws_instance.public_app : k => inst.instance_state }
}

output "instance_ips" {
  value = { for k, inst in aws_instance.public_app : k => inst.public_ip }
}

output "instance_profile" {
  value = { for k, inst in aws_instance.public_app : k => inst.iam_instance_profile }
}

output "instance_tagnecy" {
  value = { for k, inst in aws_instance.public_app : k => inst.tags}
}

output "instances" {
  value = {
    for k, inst in aws_instance.public_app : k => {
      public_ip = inst.public_ip
    }
  }
}

output "subnet_ids" {
  description = "Public subnet IDs — passed to EKS module for worker node placement"
  value       = [for s in aws_subnet.public_subnets : s.id]
}

output "security_group_ids" {
  description = "Security group IDs — passed to EKS module"
  value       = [aws_security_group.public_sg.id]
}
