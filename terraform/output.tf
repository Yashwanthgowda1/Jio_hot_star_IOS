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
output "instances" {
 value = module.ec2_vpc_infrastructure.instances 
}