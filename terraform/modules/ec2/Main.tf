data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "vpc_creation" {
  cidr_block           = var.cidr_blocks
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_hostnames
  instance_tenancy     = "default"
  tags = {
    Name        = var.vpc_cretion
    Environment = var.environment[var.selected_env]
  }
}

resource "aws_subnet" "public_subnets" {
  for_each          = local.public_subnets
  vpc_id            = aws_vpc.vpc_creation.id
  cidr_block        = cidrsubnet(var.cidr_blocks, 8, each.value)
  availability_zone = data.aws_availability_zones.available.names[each.value]
  tags = {
    Name = each.key
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc_creation.id
  tags = {
    Name        = "${var.environment["dev"]}-internet-gateway"
    Environment = var.environment[var.selected_env]
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc_creation.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.environment[var.selected_env]}-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  for_each       = aws_subnet.public_subnets
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "public_sg" {
  name        = "public-sg"
  description = "Allow HTTP/HTTPS and SSH"
  vpc_id      = aws_vpc.vpc_creation.id

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
    Name        = "${var.environment[var.selected_env]}-public-sg"
    Environment = var.environment[var.selected_env]
  }
}

resource "aws_instance" "public_app" {
  ami                         = var.aws_ami_values
  instance_type               = var.instance_type
  key_name                    = var.key_pairs
  subnet_id                   = values(aws_subnet.public_subnets)[0].id
  vpc_security_group_ids      = [aws_security_group.public_sg.id]
  associate_public_ip_address = var.aws_public_ip_enabled

  tags = {
    Name        = "${var.aws_instance}-${var.environment[var.selected_env]}"
    Environment = var.environment[var.selected_env]
  }
}