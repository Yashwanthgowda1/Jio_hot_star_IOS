# ─── region ───────────────────────────────────────────
aws_region = "ap-south-1"

# ─── environment ──────────────────────────────────────
selected_env = "dev"

# ─── vpc ──────────────────────────────────────────────
vpc_cretion          = "ci_cd_pipelineflow"
cidr_blocks          = "10.0.0.0/16"
enable_dns_hostnames = true


# ─── internet & nat gateway ───────────────────────────
igw_name = "igw-demo"
nat_gateway = ""     #if declred in varibale give umy values


# ─── ec2 ──────────────────────────────────────────────
aws_instance          = "shared_jio_hotstart_pipelines"
instance_type         = "t3.medium"
aws_ami_values        = "ami-05d2d839d4f73aafb" # Amazon Linux 2 — ap-south-1
# key_pairs             = "iam_aws"               # your key pair name in AWS (no .pem)
aws_public_ip_enabled = true

# ─── security ─────────────────────────────────────────
# my_ip is auto-fetched via data.http.my_ip in main.tf
# only set this manually if you want to hardcode your IP
# my_ip = "your.public.ip.here/32"

# ─── route table ──────────────────────────────────────
aws_route_table = "ci_cd_pipeline_routetable"

