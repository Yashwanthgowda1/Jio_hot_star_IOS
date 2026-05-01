output "ami_id" {
  value = module.ec2_vpc_infrastructure.ami_id
}
output "instence_type" {
  value = module.ec2_vpc_infrastructure.instence_type
}

output "instence_ips" {
  value = module.ec2_vpc_infrastructure.instance_ips
}

output "instance_state" {
  value = module.ec2_vpc_infrastructure.instence_state
}

output "instance_profile" {
  value = module.ec2_vpc_infrastructure.instance_profile
  
}
output "instances" {
  value = module.ec2_vpc_infrastructure.instances

}

# ── EKS Outputs ───────────────────────────────────────────────────────────────
output "eks_cluster_name" {
  description = "EKS cluster name — used in aws eks update-kubeconfig"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  value = module.eks.cluster_version
}

output "eks_node_group_status" {
  value = module.eks.node_group_status
}

# output "instances" {
#   value = {
#     var.selected_env = [
#       for inst in aws_instance.public_app : {
#         public_ip = inst.public_ip
#       }
#     ]
#   }
# }