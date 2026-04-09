locals {
  public_subnets = {
    public-1 = 0
    public-2 = 1
  }
}
# loacl resticted inside the module

# variable allow to pass the values from user

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
  description = "Enable DNS hostnames in VPC"
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
  description = "Select the environment to use: dev / prod / stage"
  type        = list(string)
  # default     = ["dev"]
}

variable "aws_instance" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "shared_jio_hotstart_pipelines"
}

variable "key_pairs" {
  description = "EC2 key pair name"
  type        = string
  default     = "iam_aws"
}

variable "instance_type" {
  description = "EC2 instance type e.g. t3.micro"
  type        = string
}

variable "aws_ami_values" {
  description = "AMI ID for the EC2 instance"
  type        = string
}

variable "aws_public_ip_enabled" {
  description = "Assign a public IP to the EC2 instance"
  type        = bool
  default     = true
}

variable "my_ip" {
  description = "Your public IP in CIDR notation e.g. 1.2.3.4/32"
  type        = string
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway"
  type        = bool
  default     = true
}

variable "igw_name" {
  description = "Name tag for the Internet Gateway"
  type        = string
  default     = "internet-gateway"
}

variable "nat_gateway" {
  description = "EIP allocation ID for NAT Gateway"
  type        = string
}

variable "security_groups_public_subnets" {
  description = "Extra security group IDs to attach"
  type        = list(string)
  default     = []
}

variable "subnets_id" {
  description = "Existing subnet IDs (leave empty when module creates them)"
  type        = list(string)
  default     = []
}

variable "aws_route_table" {
  description = "Name tag for the route table"
  type        = string
  default     = "route_table_demo_project"
}
