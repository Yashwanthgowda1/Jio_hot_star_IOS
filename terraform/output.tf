output "ami_id" {
  value = module.ec2_vpc_infrastructure.ami_id
}
output "instence_type" {
  value = module.ec2_vpc_infrastructure.instence_type
}

output "instence_state" {
  value = module.ec2_vpc_infrastructure.instence_state
}

output "instance_id" {
  value = module.ec2_vpc_infrastructure.instance_id
}
output "instance_ips" {
 value = module.ec2_vpc_infrastructure.instance_ips
}

output "instance_profile" {
  value = aws_instance.public_app.iam_instance_profile
  
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