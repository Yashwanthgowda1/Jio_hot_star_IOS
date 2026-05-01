variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "hotstar-ios-cluster"
}

variable "k8s_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "selected_env" {
  description = "Active environment: dev / prod / stage"
  type        = string
  default     = "dev"
}

variable "subnet_ids" {
  description = "Subnet IDs from EC2 module — worker nodes placed here"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs from EC2 module"
  type        = list(string)
}

variable "node_instance_type" {
  description = "EC2 instance type for worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum worker nodes"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum worker nodes (autoscaling limit)"
  type        = number
  default     = 5
}
