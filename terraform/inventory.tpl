%{ for env, instance in instances }
[${env}]
${instance.public_ip} ansible_user=ubuntu
%{ endfor }
