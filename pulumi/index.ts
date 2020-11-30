// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.

import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";


// Minikube does not implement services of type `LoadBalancer`; require the user to specify if we're
// running on minikube, and if so, create only services of type ClusterIP.
const config = new pulumi.Config();

const appName = "app";
const appLabels = { app: appName };




// application config

const app = new k8s.apps.v1.Deployment(appName, {
    metadata: { labels: appLabels, namespace: "default", name: appName ,
        annotations:{
            //"reloader.stakater.com/auto": "true"
    }},
    spec: {
        replicas: 1,
        selector: {
            matchLabels: appLabels
        },
        template: {
            metadata: { labels: appLabels },
            spec: {
                //serviceAccountName: serviceAccount.metadata.name,
                //automountServiceAccountToken: true,
             
                containers: [
                    {
                        image: `registry.hub.docker.com/tedchang77/spring-jib-app:latest`,
                        name: appName,
                        imagePullPolicy: "Always",
                        


                        env: [
                           {
                                name: 'JAVA_TOOL_OPTIONS',
                                value: "-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8888,suspend=n -Dspring.devtools.remote.secret=thisismysecret",
                                // you need to specify the non-profile config and profile config in the location property for them to be picked up in the right order. otherwise it will evaluate the profile configs after the non-profile configs
                                //value: ` -Dspring.profiles.active=dev -Dspring.config.name=db,db_secret,application  -Dspring.config.location=/tmp/db/db.properties,/tmp/db/db_secret-dev.properties,/tmp/db/db-dev.properties,/tmp/application/application.properties,/tmp/application/application-dev.properties`
                            },
                        ]
                    },
                ],
                               
            },
        },
    },
});

// Expose proxy to the public Internet.
const frontend = new k8s.core.v1.Service(appName, {
    metadata: { labels: app.spec.template.metadata.labels,namespace: "default",name: appName },
    spec: {
        type:  "ClusterIP",
        ports: [
            { name: "app", port: 80, targetPort: 8080, protocol: "TCP" },
            { name: "debug", port: 8888, targetPort: 8888, protocol: "TCP"}
        ],
        selector: appLabels,
    },
});

// Export the frontend IP.
export let frontendIp: pulumi.Output<string>;
frontendIp = frontend.spec.clusterIP;
