
%{ for env, instances_list in instances }
[${env}]
%{ for instance in instances_list }
${instance.public_ip} ansible_user=ubuntu
%{ endfor }
%{ endfor }


