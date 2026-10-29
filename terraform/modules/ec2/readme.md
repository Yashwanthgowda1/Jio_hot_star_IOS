locals {
  subnet_configs = flatten([
    for env in var.selected_env : [        # outer loop: each environment
      for name, idx in local.public_subnets : {  # inner loop: each subnet
        key   = "${env}-${name}"   # "dev-public-1" ← unique ID for for_each
        env   = env                # "dev"          ← to look up the VPC
        index = idx                # 0              ← to calc cidr + AZ
      }
    ]
  ])
}


Result looks like this:
#   [
#     { key = "dev-public-1",  env = "dev",  index = 0 },
#     { key = "dev-public-2",  env = "dev",  index = 1 },
#     { key = "prod-public-1", env = "prod", index = 0 },
#     { key = "prod-public-2", env = "prod", index = 1 },
#   ]

# for_each requires a FLAT MAP  (not nested)
# So we flatten: [dev × subnets] + [prod × subnets] → flat list



# ─────────────────────────────────────────────────────────────
# Both IGW and route table are 1-per-env → toset is enough
# No need for flatten here
# ─────────────────────────────────────────────────────────────







# ─────────────────────────────────────────────────────────────
# Association: every subnet must be linked to its env's route table
#
# aws_subnet.public_subnets keys = {
#   "dev-public-1", "dev-public-2", "prod-public-1", "prod-public-2"
# }
#
# We need: which env does this subnet belong to?
# Answer: split the key on "-" and take the first part
#   split("-", "dev-public-1")[0] = "dev"
#   split("-", "prod-public-2")[0] = "prod"
# ─────────────────────────────────────────────────────────────

resource "aws_route_table_association" "public_rt_assoc" {
  for_each = aws_subnet.public_subnets
  # each.key = "dev-public-1"

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_rt[split("-", each.key)[0]].id
  #                                           ^^^^^^^^^^^^^^^^^^^^^^^^
  #                                           split("dev-public-1") → "dev"
  #                                           looks up aws_route_table.public_rt["dev"]
}