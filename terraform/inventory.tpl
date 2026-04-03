
%{ for env, instances_list in instanceList }
[${env}]
%{ for instance in instances_list }
${instance.public_ip} ansible_user=ubuntu
%{ endfor }

%{ endfor }


