# Setup Jenkins Local

* Note: All commands run from root

1. Refer to [Docker Readme File](DOCKER-README.md) for initial development setup
2. sh docker/start jenkins
3. eval (docker-machine env platform-dev)
4. docker exec -it platform_jenkins_1 sh /var/jenkins/restore
5. curl -I jenkins.platform.local.com/restart