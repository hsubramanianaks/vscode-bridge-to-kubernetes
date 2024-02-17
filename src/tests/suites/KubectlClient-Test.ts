// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
'use strict';

import * as k8s from '@kubernetes/client-node';
import { beforeEach, describe, it } from 'mocha';
import * as sinon from 'sinon';
import { CommandRunner } from '../../clients/CommandRunner';
import { KubectlClient } from '../../clients/KubectlClient';
import { IKubernetesIngress } from '../../models/IKubernetesIngress';
import { IKubernetesService } from '../../models/IKubernetesService';
import { AccountContextManager } from '../../models/context/AccountContextManager';
import { accountContextManagerStub, commandRunnerStub, loggerStub } from '../CommonTestObjects';

describe(`KubectlClient Test`, () => {
    beforeEach(() => {
        sinon.restore();
    });
    it(`getIngressesAsync when the kubectl command returns a set of various ingresses`, async () => {
        const returnString = `{
            "apiVersion": "v1",
            "items": [
                {
                    "apiVersion": "networking.k8s.io/v1",
                    "kind": "Ingress",
                    "metadata": {
                        "annotations": {
                            "kubernetes.io/ingress.class": "traefik",
                            "meta.helm.sh/release-name": "bikesharingsampleapp",
                            "meta.helm.sh/release-namespace": "dev"
                        },
                        "creationTimestamp": "2020-05-12T01:02:49Z",
                        "generation": 1,
                        "labels": {
                            "app": "bikesharingweb",
                            "app.kubernetes.io/managed-by": "Helm",
                            "chart": "bikesharingweb-0.1.0",
                            "heritage": "Helm",
                            "release": "bikesharingsampleapp"
                        },
                        "name": "bikesharingweb",
                        "namespace": "dev",
                        "resourceVersion": "1314825",
                        "uid": "8044fe48-4e8c-454b-b8de-553d0988666e"
                    },
                    "spec": {
                        "rules": [
                            {
                                "host": "dev.bikesharingweb.j7l6v4gz8d.eus.mindaro.io",
                                "http": {
                                    "paths": [
                                        {
                                            "backend": {
                                                "service": {
                                                    "name": "bikesharingweb",
                                                    "port": {
                                                        "number": 80
                                                    }
                                                }
                                            },
                                            "path": "/"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "status": {
                        "loadBalancer": {
                            "ingress": [
                                {
                                    "ip": "13.72.80.227"
                                }
                            ]
                        }
                    }
                },
                {
                    "apiVersion": "networking.k8s.io/v1",
                    "kind": "Ingress",
                    "metadata": {
                        "annotations": {
                            "kubernetes.io/ingress.class": "traefik",
                            "meta.helm.sh/release-name": "bikesharingsampleapp",
                            "meta.helm.sh/release-namespace": "dev"
                        },
                        "creationTimestamp": "2020-05-12T01:02:49Z",
                        "generation": 1,
                        "labels": {
                            "app": "gateway",
                            "app.kubernetes.io/managed-by": "Helm",
                            "chart": "gateway-0.1.0",
                            "heritage": "Helm",
                            "release": "bikesharingsampleapp"
                        },
                        "name": "gateway",
                        "namespace": "dev",
                        "resourceVersion": "1314824",
                        "uid": "0b61f6fa-f6ad-4a01-b1b2-89255bed41ca"
                    },
                    "spec": {
                        "rules": [
                            {
                                "host": "dev.gateway.j7l6v4gz8d.eus.mindaro.io",
                                "http": {
                                    "paths": [
                                        {
                                            "backend": {
                                                "service": {
                                                    "name": "gateway",
                                                    "port": {
                                                        "number": 80
                                                    }
                                                }
                                            },
                                            "path": "/"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "status": {
                        "loadBalancer": {
                            "ingress": [
                                {
                                    "ip": "13.72.80.227"
                                }
                            ]
                        }
                    }
                }
            ]
        }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        let ingresses: IKubernetesIngress[];
        ingresses = await kubectlClient.getIngressesAsync(`dev`, `c:/users/alias/.kube/config`, true);

        import('chai')
            .then(chai => chai.expect(ingresses.length).to.equal(2))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[0].name).to.equal(`bikesharingweb`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[0].namespace).to.equal(`dev`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[0].host).to.equal(`dev.bikesharingweb.j7l6v4gz8d.eus.mindaro.io`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[0].protocol).to.equal(`http`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[1].name).to.equal(`gateway`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[1].namespace).to.equal(`dev`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[1].host).to.equal(`dev.gateway.j7l6v4gz8d.eus.mindaro.io`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(ingresses[1].protocol).to.equal(`http`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it(`getIngressesAsync when the kubectl command returns no ingresses`, async () => {
        const returnString = `{ "items": [] }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        const ingresses: IKubernetesIngress[] = await kubectlClient.getIngressesAsync(`dev`, `c:/users/alias/.kube/config`, true);

        import('chai')
            .then(chai => chai.expect(ingresses.length).to.equal(0))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it(`getIngressesAsync when the kubectl command returns ingresses without service`, async () => {
        const returnString = `{
            "apiVersion": "v1",
            "items": [
                {
                    "apiVersion": "networking.k8s.io/v1",
                    "kind": "Ingress",
                    "metadata": {
                        "annotations": {
                            "kubernetes.io/ingress.class": "traefik",
                            "meta.helm.sh/release-name": "bikesharingsampleapp",
                            "meta.helm.sh/release-namespace": "dev"
                        },
                        "creationTimestamp": "2020-05-12T01:02:49Z",
                        "generation": 1,
                        "labels": {
                            "app": "bikesharingweb",
                            "app.kubernetes.io/managed-by": "Helm",
                            "chart": "bikesharingweb-0.1.0",
                            "heritage": "Helm",
                            "release": "bikesharingsampleapp"
                        },
                        "name": "bikesharingweb",
                        "namespace": "dev",
                        "resourceVersion": "1314825",
                        "uid": "8044fe48-4e8c-454b-b8de-553d0988666e"
                    },
                    "spec": {
                        "rules": [
                            {
                                "host": "dev.bikesharingweb.j7l6v4gz8d.eus.mindaro.io",
                                "http": {
                                    "paths": [
                                        {
                                            "backend": {},
                                            "path": "/"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "status": {
                        "loadBalancer": {
                            "ingress": [
                                {
                                    "ip": "13.72.80.227"
                                }
                            ]
                        }
                    }
                },
                {
                    "apiVersion": "networking.k8s.io/v1",
                    "kind": "Ingress",
                    "metadata": {
                        "annotations": {
                            "kubernetes.io/ingress.class": "traefik",
                            "meta.helm.sh/release-name": "bikesharingsampleapp",
                            "meta.helm.sh/release-namespace": "dev"
                        },
                        "creationTimestamp": "2020-05-12T01:02:49Z",
                        "generation": 1,
                        "labels": {
                            "app": "gateway",
                            "app.kubernetes.io/managed-by": "Helm",
                            "chart": "gateway-0.1.0",
                            "heritage": "Helm",
                            "release": "bikesharingsampleapp"
                        },
                        "name": "gateway",
                        "namespace": "dev",
                        "resourceVersion": "1314824",
                        "uid": "0b61f6fa-f6ad-4a01-b1b2-89255bed41ca"
                    },
                    "spec": {
                        "rules": [
                            {
                                "host": "dev.gateway.j7l6v4gz8d.eus.mindaro.io",
                                "http": {
                                    "paths": [
                                        {
                                            "backend": {
                                                "service": {}
                                            },
                                            "path": "/"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "status": {
                        "loadBalancer": {
                            "ingress": [
                                {
                                    "ip": "13.72.80.227"
                                }
                            ]
                        }
                    }
                }
            ]
        }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        let ingresses: IKubernetesIngress[];
        ingresses = await kubectlClient.getIngressesAsync(`dev`, `c:/users/alias/.kube/config`, false);
        import('chai')
            .then(chai => chai.expect(ingresses.length).to.equal(0))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it(`getServicesAsync when the kubectl command returns a set of various services`, async () => {
        const returnString = `{
                        "items": [
                            {
                                "metadata": {
                                    "name": "bikes",
                                    "namespace": "dev"
                                },
                                "spec": {
                                    "selector": {
                                        "app": "bikes",
                                        "release": "bikesharing"
                                    }
                                }
                            },
                            {
                                "metadata": {
                                    "name": "routingmanager-service",
                                    "namespace": "dev"
                                },
                                "spec": {
                                    "selector": {
                                        "app": "routingmanager-service",
                                        "release": "routingmanager"
                                    }
                                }
                            },
                            {
                                "metadata": {
                                    "name": "bikesharingweb",
                                    "namespace": "dev"
                                },
                                "spec": {
                                    "selector": {
                                        "app": "bikesharingweb",
                                        "release": "bikesharing"
                                    }
                                }
                            },
                            {
                                "metadata": {
                                    "labels": {
                                        "routing.visualstudio.io/generated": "true"
                                    },
                                    "name": "bikesharingwebclone",
                                    "namespace": "dev"
                                },
                                "spec": {
                                    "selector": {
                                        "app": "bikesharingwebclone",
                                        "release": "bikesharing"
                                    }
                                }
                            }
                        ]
                    }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        const services: IKubernetesService[] = await kubectlClient.getServicesAsync();

        import('chai')
            .then(chai => chai.expect(services.length).to.equal(2))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].name).to.equal(`bikes`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].namespace).to.equal(`dev`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].selector[`app`]).to.equal(`bikes`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].selector[`release`]).to.equal(`bikesharing`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[1].name).to.equal(`bikesharingweb`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[1].namespace).to.equal(`dev`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[1].selector[`app`]).to.equal(`bikesharingweb`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[1].selector[`release`]).to.equal(`bikesharing`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it(`getServicesAsync when the kubectl command returns no services`, async () => {
        const returnString = `{ "items": [] }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        const services: IKubernetesService[] = await kubectlClient.getServicesAsync();

        import('chai')
            .then(chai => chai.expect(services.length).to.equal(0))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it(`getNamespacesAsync when the kubectl command returns a set of various namespaces`, async () => {
        const returnString = `default kube-node-lease voting-app`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        const namespaces: string[] = await kubectlClient.getNamespacesAsync(`c:/users/alias/.kube/config`);

        import('chai')
            .then(chai => chai.expect(namespaces.length).to.equal(3))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(namespaces[0]).to.equal(`default`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(namespaces[1]).to.equal(`kube-node-lease`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(namespaces[2]).to.equal(`voting-app`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });
    it(`getServicesAsync when the kubectl command returns services in system namespaces`, async () => {
        const returnString = `{
            "items": [
                {
                    "metadata": {
                        "name": "azds-webhook-service",
                        "namespace": "azds"
                    },
                    "spec": {
                        "selector": {
                            "component": "azds-injector-webhook",
                            "service": "azds-webhook-service"
                        }
                    }
                },
                {
                    "metadata": {
                        "name": "kube-public-service",
                        "namespace": "kube-public"
                    }
                },
                {
                    "metadata": {
                        "name": "bikes",
                        "namespace": "dev"
                    },
                    "spec": {
                        "selector": {
                            "app": "bikes",
                            "release": "bikesharing"
                        }
                    }
                },
                {
                    "metadata": {
                        "name": "kube-dns",
                        "namespace": "kube-system"
                    },
                    "spec": {
                        "selector": {
                            "k8s-app": "kube-dns"
                        }
                    }
                }
            ]
        }`;
        const commandRunnerStub = sinon.createStubInstance(CommandRunner);
        commandRunnerStub.runAsync.resolves(returnString);
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, accountContextManagerStub, loggerStub);
        const services: IKubernetesService[] = await kubectlClient.getServicesAsync();

        // Validate that the services in system namespaces have been filtered out properly.
        import('chai')
            .then(chai => chai.expect(services.length).to.equal(1))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].name).to.equal(`bikes`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].namespace).to.equal(`dev`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].selector[`app`]).to.equal(`bikes`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(services[0].selector[`release`]).to.equal(`bikesharing`))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getPodNames for selected service name', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedEndpoints.resolves({
            response: {},
            body: {
                metadata: {
                    name: 'stats-api',
                    namespace: 'namespace'
                },
                subsets: [{
                    addresses: [{
                        ip: 'sampleip',
                        targetRef: {
                            name: 'stats-api-ff7d66c5b-4nc9x'
                        }
                    }]
                }]
            }
        })
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const podNames: string[] = await kubectlClient.getPodNames(`stats-api`, `namespace`);
        import('chai')
            .then(chai => chai.expect(podNames[0]).to.equal('stats-api-ff7d66c5b-4nc9x'))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getPodNames for selected service name when no pod is found', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedEndpoints.resolves({
            response: {},
            body: {
                metadata: {
                    name: 'stats-api',
                    namespace: 'namespace'
                },
                subsets: [{
                    addresses: []
                }]
            }
        })
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const podNames: string[] = await kubectlClient.getPodNames(`stats-api`, `namespace`);
        import('chai')
            .then(chai => chai.expect(podNames.length).to.equal(0))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getPodNames for selected service name when multiple pods are found', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedEndpoints.resolves({
            response: {},
            body: {
                metadata: {
                    name: 'stats-api',
                    namespace: 'namespace'
                },
                subsets: [{
                    addresses: [{
                        ip: 'sampleip',
                        targetRef: {
                            name: 'stats-api-ff7d66c5b-4nc9x'
                        }
                    }, {
                        ip: 'sampleip2',
                        targetRef: {
                            name: 'stats-api-ff7d66c5b-4nc5k'
                        }
                    }]
                }]
            }
        })
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const podNames: string[] = await kubectlClient.getPodNames(`stats-api`, `namespace`);
        import('chai')
            .then(chai => chai.expect(podNames[0]).to.equal('stats-api-ff7d66c5b-4nc9x'))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(podNames[1]).to.equal('stats-api-ff7d66c5b-4nc5k'))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getPodNames for selected service name when readNamespacedEndpoints throws error', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedEndpoints.throws("error");
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const podNames: string[] = await kubectlClient.getPodNames(`stats-api`, `namespace`);
        import('chai')
            .then(chai => chai.expect(podNames).to.be.null)
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getContainerNames for selected pod name', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedPod.resolves({
            response: {},
            body: {
                metadata: {
                    name: 'stats-api-ff7d66c5b-4nc9x',
                    namespace: 'namespace'
                },
                spec: {
                    containers: [{
                        name: 'stats-api'
                    }]
                }
            }
        });
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const containerNames: string[] = await kubectlClient.getContainerNames('stats-api-ff7d66c5b-4nc9x', 'namespace');
        import('chai')
            .then(chai => chai.expect(containerNames.length).not.to.equal(0))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
        import('chai')
            .then(chai => chai.expect(containerNames[0]).to.equal('stats-api'))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getContainerNames for selected pod name when multiple containers are found', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedPod.resolves({
            response: {},
            body: {
                metadata: {
                    name: 'stats-api-ff7d66c5b-4nc9x',
                    namespace: 'namespace'
                },
                spec: {
                    containers: [{
                        name: 'stats-api'
                    },
                    {
                        name: 'linkerd-proxy'
                    }]
                }
            }
        });
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const containerNames: string[] = await kubectlClient.getContainerNames('stats-api-ff7d66c5b-4nc9x', 'namespace');
        import('chai')
            .then(chai => chai.expect(containerNames.length).to.equal(2))
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });

    it('getContainerNames for selected pod name when readNamespacedPod throws error', async () => {
        const acctContextManagerStubLocal = sinon.createStubInstance(AccountContextManager);
        const k8sClientMock = {
            k8sApi: sinon.createStubInstance(k8s.CoreV1Api)
        }
        acctContextManagerStubLocal.getK8sClient.resolves(k8sClientMock.k8sApi);
        k8sClientMock.k8sApi.readNamespacedPod.throws("error");
        const kubectlClient = new KubectlClient(`my/path/kubectl.exe`, commandRunnerStub, acctContextManagerStubLocal, loggerStub);
        const containerNames: string[] = await kubectlClient.getContainerNames('stats-api-ff7d66c5b-4nc9x', 'namespace');
        import('chai')
            .then(chai => chai.expect(containerNames).to.be.null)
            .catch(err => console.log('this is chai error message, should not happen and error is: ', err));
    });
});