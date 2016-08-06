# Docker Gotchas

### When You need to run `sh docker/restart`

```bash

########################################################
####             Start Docker Environment           ####
########################################################

									.
									.
									.

Start Machine...
Starting "platform-dev"...
(platform-dev) Check network to re-create if needed...
(platform-dev) Waiting for an IP...
Machine "platform-dev" was started.
Waiting for SSH to be available...
Detecting the provisioner...
Started machines may have new IP addresses. You may need to re-run the `docker-machine env` command.

`( error )`
Attach Machine to Terminal...
Error checking TLS connection: Error checking and/or regenerating the certs: There was an error validating certificates for host "192.168.99.100:2376": tls: DialWithDialer timed out
You can attempt to regenerate them using 'docker-machine regenerate-certs [name]'.
Be advised that this will trigger a Docker daemon restart which will stop running containers.

									.
									.
									.                                   

`( error )`
Attach Machine to Terminal...
Error checking TLS connection: Error checking and/or regenerating the certs: There was an error validating certificates for host "192.168.99.100:2376": tls: DialWithDialer timed out
You can attempt to regenerate them using 'docker-machine regenerate-certs [name]'.
Be advised that this will trigger a Docker daemon restart which will stop running containers.

									.
									.
									.

`( error )`
Build Docker Images...
Building website
ERROR: Couldn't connect to Docker daemon - you might need to run `docker-machine start default`.

Start Docker Images...
-e 2016-04-22 08:41:54 [ERROR] Start a VM with docker-machine start [machine-name]; eval (docker-machine env [docker-machine]) before running this command

```
