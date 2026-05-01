output "cluster_name" {
  description = "EKS cluster name — used in ci-cd.yml aws eks update-kubeconfig"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_version" {
  value = aws_eks_cluster.main.version
}

output "node_group_status" {
  description = "Worker node group status"
  value       = aws_eks_node_group.workers.status
}
