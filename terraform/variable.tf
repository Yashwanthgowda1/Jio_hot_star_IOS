variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cretion" {
  description = "VPC name tag"
  type        = string
  default     = "ci_cd_pipelineflow"
}

variable "cidr_blocks" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames"
  type        = bool
  default     = true
}

variable "environment" {
  description = "Environment name map"
  type        = map(string)
  default = {
    dev   = "development"
    prod  = "production"
    stage = "staging"
  }
}

variable "selected_env" {
  description = "Active environment: dev / prod / stage"
  type        = string
  # default     = "dev"
}

variable "aws_instance" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "shared_jio_hotstart_pipelines"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "aws_ami_values" {
  description = "AMI ID"
  type        = string
}

variable "key_pairs" {
  description = "EC2 key pair name"
  type        = string
  default     = "iam_aws.pem"
}

variable "aws_public_ip_enabled" {
  description = "Assign public IP to EC2"
  type        = bool
  default     = true
}

variable "nat_gateway" {
  description = "EIP allocation ID for NAT Gateway"
  type        = string
}
variable "igw_name" {
  description = "Name tag for the Internet Gateway"
  type        = string
  default     = "internet-gateway"
}

variable "aws_route_table" {
  description = "Name tag for the route table"
  type        = string
  default     = "route_table_demo_project"
}