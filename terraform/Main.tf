data "http" "my_ip" {
  url = "https://checkip.amazonaws.com/"
}

provider "aws" {
  region = var.aws_region
}

module "ec2_vpc_infrastructure" {
  source = "./modules/ec2"

  # network
  vpc_cretion          = var.vpc_cretion
  cidr_blocks          = var.cidr_blocks
  enable_dns_hostnames = var.enable_dns_hostnames
  igw_name             = "igw-demo"
  nat_gateway          = var.nat_gateway
  aws_route_table      = "ci_cd_pipeline_routetable"

  # subnets / security
  # extra not used
  # Your module creates everything itself:
  # ```
  # subnets        → created by aws_subnet.public_subnets
  # security group → created by aws_security_group.public_sg
  subnets_id                     = []
  security_groups_public_subnets = []

  # environment
  environment  = var.environment
  selected_env = var.selected_env

  # ec2
  aws_instance          = var.aws_instance
  instance_type         = var.instance_type
  aws_ami_values        = var.aws_ami_values
  key_pairs             = var.key_pairs
  aws_public_ip_enabled = var.aws_public_ip_enabled

  # resolved at apply time — data source interpolation not allowed in variable defaults
  my_ip = "${chomp(data.http.my_ip.response_body)}/32"
}