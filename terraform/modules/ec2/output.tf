output "ami_id" {
  value = { for env, inst in aws_instance.public_app : env => inst.ami }
}
output "instence_type" {
  value = { for env, inst in aws_instance.public_app : env => inst.instance_type }
}

output "instence_state" {
  value = { for env, inst in aws_instance.public_app : env => inst.instance_state }
}

output "instance_ips" {
  value = { for env, inst in aws_instance.public_app : env => inst.public_ip }
}

output "instance_profile" {
  value = { for env, inst in aws_instance.public_app : env => inst.iam_instance_profile }
  
}
output "instance_tagnecy" {
  value = { for env, inst in aws_instance.public_app : env => inst.tags }
}


output "instances" {
  value = {
    for env, inst in aws_instance.public_app : env => {
      public_ip = inst.public_ip
      instance_id = inst.id
    }
  }
}