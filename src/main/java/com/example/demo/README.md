
This demo uses:
- pulumi program to deploy spring boot application and expose 2 services: one for rest endpoint on port 80 and debug port on 8888
- kubefwd to expose all services including remote debugging
- jib to build docker image: mvn compile jib:build -Dimage=registry.hub.docker.com/tedchang77/spring-jib-app
- ksync to synch class files from target\classes to /app/classes automatically:  ksync create --selector=app=app "c:\users\t954790\projects\spring-demo\demo\target\classes" /app/classes
- spring devtools to attach debugger to port 8888

PoC that shows any code changes are automatically synched with pod running in k8s cluster and the ability to connect debugger to remote application.


