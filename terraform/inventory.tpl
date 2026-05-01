
%{ for env, instance_data in instances }
[${env}]
${instance_data.public_ip} ansible_user=ubuntu
%{ endfor }


