### in the docker in this project 
there 2 types of volume:
1. volume
2. bind mount  --> use the volume of host path insted of the volume

## Terraform
     for_each : looping at ecah iteration and create the resource
     templetfile : to create the file usoing this templetfile and pass the dynamic values to   the    templetfile and create the file with the dynamic values
        example :
        1.           resource "local_file" "ansible_inventory" {
                    content = templatefile("${path.module}/inventory.tpl", {

                        *** collect all the servere in diffent env ****
                      instances = aws_instance.server
                    })

                    filename = "${path.module}/inventory.ini"
                    
                    }

        2.  this is the templet so that what are the instnce collected are for looping  collecting       env and ips and  

                    ✅ Key takeaway:

                    %{ for ... } → template file syntax (used inside .tpl with templatefile())
                    for ... in ... → Terraform expression (used in .tf files for maps/lists

            %{ for env, instance in instances }
            [${env}]
            ${instance.public_ip} ansible_user=ubuntu
            %{ endfor } 
            

         <!-- -------------------------------------------------------------- -->
          3.           output "instances" {
                        value = {    <-- in dictonery format>
                            var.selected_env = [    <-- in which env >
                            for inst in aws_instance.public_app : {   <-- in dict  form >
                                public_ip = inst.public_ip
                }
                ]
            }
            }    

            ### like this 
            values={
                "dev" = [
                    { public_ip = "3.14.159.26" },
                    { public_ip = "3.14.159.27" }
                ]   <--- list of dict form >
                "prod" = [
                    { public_ip = "178,78,93,8"}
                ]


            }


### Ansible setups and pre-reqasits

when need to pass the private key to ansible then we need to use the bind mount and pass the path of private key in the host machine to the container and then use that path in the ansible command to run the playbook

means ->: pass the private key stored in the secrates of github while runnig the ansible cmd using the --private-key option and secrates will be passed 

--limt  when linit the server to run the playbook on specific server
        ####ansible-playbook -i inventory.ini deploy.yml --limit dev

-u remote host
        #### ansible-playbook -i inventory.ini deploy.yml -u ubuntu     

--ask-pass (Use SSH Password)
    Used when the server does not use SSH key authentication. asking the password like enter password

    Example:

            #### ansible-playbook -i inventory.ini deploy.yml --ask-pass


