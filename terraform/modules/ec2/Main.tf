data "aws_availability_zones" "available" {
  state = "available"
}

# to avoid confusins
locals {
  env_subnet_map = {
    for env in var.selected_env : env => local.public_subnets
  }
  
# {
#   dev  = { "public-1" = 0, "public-2" = 1 }
#   prod = { "public-1" = 0, "public-2" = 1 }
# }

  subnet_configs = flatten([
    for env in var.selected_env : [
      for subnet_name, subnet_index in local.public_subnets : {
        key   = "${env}-${subnet_name}"
        env   = env
        index = subnet_index
      }
    ]
  ])
}

#  Result (flat list):
# [
#   { key="dev-public-1",  env="dev",  index=0 },
#   { key="dev-public-2",  env="dev",  index=1 },
#   { key="prod-public-1", env="prod", index=0 },
#   { key="prod-public-2", env="prod", index=1 },
# ]

resource "aws_vpc" "vpc_creation" {
  for_each             = toset(var.selected_env)
  cidr_block           = var.cidr_blocks
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_hostnames
  instance_tenancy     = "default"
  tags = {
    Name        = "${var.vpc_cretion}-${each.value}"
    Environment = var.environment[each.value]
  }
}

resource "aws_subnet" "public_subnets" {
  for_each = { for config in local.subnet_configs : config.key => config }

  vpc_id            = aws_vpc.vpc_creation[each.value.env].id
  cidr_block        = cidrsubnet(var.cidr_blocks, 8, each.value.index)
  availability_zone = data.aws_availability_zones.available.names[each.value.index]
  tags = {
    Name = each.key
  }
}

resource "aws_internet_gateway" "igw" {
  for_each = toset(var.selected_env)
  vpc_id   = aws_vpc.vpc_creation[each.value].id
  tags = {
    Name        = "${var.environment[each.value]}-internet-gateway"
    Environment = var.environment[each.value]
  }
}

resource "aws_route_table" "public_rt" {
  for_each = toset(var.selected_env)
  vpc_id   = aws_vpc.vpc_creation[each.value].id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw[each.value].id
  }

  tags = {
    Name = "${var.environment[each.value]}-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  for_each = aws_subnet.public_subnets

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_rt[split("-", each.key)[0]].id
}

resource "aws_security_group" "public_sg" {
  for_each    = toset(var.selected_env)
  name        = "public-sg-${each.value}"
  description = "Allow HTTP/HTTPS and SSH"
  vpc_id      = aws_vpc.vpc_creation[each.value].id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment[each.value]}-public-sg"
    Environment = var.environment[each.value]
  }
}

resource "aws_instance" "public_app" {
  for_each                    = toset(var.selected_env)
  ami                         = var.aws_ami_values
  instance_type               = var.instance_type
  key_name                    = var.key_pairs
  subnet_id                   = aws_subnet.public_subnets["${each.value}-public-1"].id
  vpc_security_group_ids      = [aws_security_group.public_sg[each.value].id]
  associate_public_ip_address = var.aws_public_ip_enabled

  tags = {
    Name        = "${var.aws_instance}-${var.environment[each.value]}"
    Environment = var.environment[each.value]
  }
}
