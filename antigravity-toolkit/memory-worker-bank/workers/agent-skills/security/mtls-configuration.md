# mtls-configuration
Source: https://antigravity.codes/agent-skills/security/mtls-configuration

## AI Worker Instructions
When the user requests functionality related to mtls-configuration, follow these guidelines and utilize this context.

## Scraped Content

# mtls-configuration
```
┌─────────┐                              ┌─────────┐│ Service │                              │ Service ││    A    │                              │    B    │└────┬────┘                              └────┬────┘     │                                        │┌────┴────┐      TLS Handshake          ┌────┴────┐│  Proxy  │◄───────────────────────────►│  Proxy  ││(Sidecar)│  1. ClientHello             │(Sidecar)││         │  2. ServerHello + Cert      │         ││         │  3. Client Cert             │         ││         │  4. Verify Both Certs       │         ││         │  5. Encrypted Channel       │         │└─────────┘                              └─────────┘
```
```
┌─────────┐                              ┌─────────┐│ Service │                              │ Service ││    A    │                              │    B    │└────┬────┘                              └────┬────┘     │                                        │┌────┴────┐      TLS Handshake          ┌────┴────┐│  Proxy  │◄───────────────────────────►│  Proxy  ││(Sidecar)│  1. ClientHello             │(Sidecar)││         │  2. ServerHello + Cert      │         ││         │  3. Client Cert             │         ││         │  4. Verify Both Certs       │         ││         │  5. Encrypted Channel       │         │└─────────┘                              └─────────┘
```
```
Root CA (Self-signed, long-lived)    │    ├── Intermediate CA (Cluster-level)    │       │    │       ├── Workload Cert (Service A)    │       └── Workload Cert (Service B)    │    └── Intermediate CA (Multi-cluster)            │            └── Cross-cluster certs
```
```
Root CA (Self-signed, long-lived)    │    ├── Intermediate CA (Cluster-level)    │       │    │       ├── Workload Cert (Service A)    │       └── Workload Cert (Service B)    │    └── Intermediate CA (Multi-cluster)            │            └── Cross-cluster certs
```
```
# Enable strict mTLS mesh-wideapiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: istio-systemspec:  mtls:    mode: STRICT---# Namespace-level override (permissive for migration)apiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: legacy-namespacespec:  mtls:    mode: PERMISSIVE---# Workload-specific policyapiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: payment-service  namespace: productionspec:  selector:    matchLabels:      app: payment-service  mtls:    mode: STRICT  portLevelMtls:    8080:      mode: STRICT    9090:      mode: DISABLE # Metrics port, no mTLS
```
```
# Enable strict mTLS mesh-wideapiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: istio-systemspec:  mtls:    mode: STRICT---# Namespace-level override (permissive for migration)apiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: legacy-namespacespec:  mtls:    mode: PERMISSIVE---# Workload-specific policyapiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: payment-service  namespace: productionspec:  selector:    matchLabels:      app: payment-service  mtls:    mode: STRICT  portLevelMtls:    8080:      mode: STRICT    9090:      mode: DISABLE # Metrics port, no mTLS
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: default  namespace: istio-systemspec:  host: "*.local"  trafficPolicy:    tls:      mode: ISTIO_MUTUAL---# TLS to external serviceapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: external-apispec:  host: api.external.com  trafficPolicy:    tls:      mode: SIMPLE      caCertificates: /etc/certs/external-ca.pem---# Mutual TLS to external serviceapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: partner-apispec:  host: api.partner.com  trafficPolicy:    tls:      mode: MUTUAL      clientCertificate: /etc/certs/client.pem      privateKey: /etc/certs/client-key.pem      caCertificates: /etc/certs/partner-ca.pem
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: default  namespace: istio-systemspec:  host: "*.local"  trafficPolicy:    tls:      mode: ISTIO_MUTUAL---# TLS to external serviceapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: external-apispec:  host: api.external.com  trafficPolicy:    tls:      mode: SIMPLE      caCertificates: /etc/certs/external-ca.pem---# Mutual TLS to external serviceapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: partner-apispec:  host: api.partner.com  trafficPolicy:    tls:      mode: MUTUAL      clientCertificate: /etc/certs/client.pem      privateKey: /etc/certs/client-key.pem      caCertificates: /etc/certs/partner-ca.pem
```
```
# Install cert-manager issuer for IstioapiVersion: cert-manager.io/v1kind: ClusterIssuermetadata:  name: istio-caspec:  ca:    secretName: istio-ca-secret---# Create Istio CA secretapiVersion: v1kind: Secretmetadata:  name: istio-ca-secret  namespace: cert-managertype: kubernetes.io/tlsdata:  tls.crt: <base64-encoded-ca-cert>  tls.key: <base64-encoded-ca-key>---# Certificate for workloadapiVersion: cert-manager.io/v1kind: Certificatemetadata:  name: my-service-cert  namespace: my-namespacespec:  secretName: my-service-tls  duration: 24h  renewBefore: 8h  issuerRef:    name: istio-ca    kind: ClusterIssuer  commonName: my-service.my-namespace.svc.cluster.local  dnsNames:    - my-service    - my-service.my-namespace    - my-service.my-namespace.svc    - my-service.my-namespace.svc.cluster.local  usages:    - server auth    - client auth
```
```
# Install cert-manager issuer for IstioapiVersion: cert-manager.io/v1kind: ClusterIssuermetadata:  name: istio-caspec:  ca:    secretName: istio-ca-secret---# Create Istio CA secretapiVersion: v1kind: Secretmetadata:  name: istio-ca-secret  namespace: cert-managertype: kubernetes.io/tlsdata:  tls.crt: <base64-encoded-ca-cert>  tls.key: <base64-encoded-ca-key>---# Certificate for workloadapiVersion: cert-manager.io/v1kind: Certificatemetadata:  name: my-service-cert  namespace: my-namespacespec:  secretName: my-service-tls  duration: 24h  renewBefore: 8h  issuerRef:    name: istio-ca    kind: ClusterIssuer  commonName: my-service.my-namespace.svc.cluster.local  dnsNames:    - my-service    - my-service.my-namespace    - my-service.my-namespace.svc    - my-service.my-namespace.svc.cluster.local  usages:    - server auth    - client auth
```
```
# SPIRE Server configurationapiVersion: v1kind: ConfigMapmetadata:  name: spire-server  namespace: spiredata:  server.conf: |    server {      bind_address = "0.0.0.0"      bind_port = "8081"      trust_domain = "example.org"      data_dir = "/run/spire/data"      log_level = "INFO"      ca_ttl = "168h"      default_x509_svid_ttl = "1h"    }    plugins {      DataStore "sql" {        plugin_data {          database_type = "sqlite3"          connection_string = "/run/spire/data/datastore.sqlite3"        }      }      NodeAttestor "k8s_psat" {        plugin_data {          clusters = {            "demo-cluster" = {              service_account_allow_list = ["spire:spire-agent"]            }          }        }      }      KeyManager "memory" {        plugin_data {}      }      UpstreamAuthority "disk" {        plugin_data {          key_file_path = "/run/spire/secrets/bootstrap.key"          cert_file_path = "/run/spire/secrets/bootstrap.crt"        }      }    }---# SPIRE Agent DaemonSet (abbreviated)apiVersion: apps/v1kind: DaemonSetmetadata:  name: spire-agent  namespace: spirespec:  selector:    matchLabels:      app: spire-agent  template:    spec:      containers:        - name: spire-agent          image: ghcr.io/spiffe/spire-agent:1.8.0          volumeMounts:            - name: spire-agent-socket              mountPath: /run/spire/sockets      volumes:        - name: spire-agent-socket          hostPath:            path: /run/spire/sockets            type: DirectoryOrCreate
```
```
# SPIRE Server configurationapiVersion: v1kind: ConfigMapmetadata:  name: spire-server  namespace: spiredata:  server.conf: |    server {      bind_address = "0.0.0.0"      bind_port = "8081"      trust_domain = "example.org"      data_dir = "/run/spire/data"      log_level = "INFO"      ca_ttl = "168h"      default_x509_svid_ttl = "1h"    }    plugins {      DataStore "sql" {        plugin_data {          database_type = "sqlite3"          connection_string = "/run/spire/data/datastore.sqlite3"        }      }      NodeAttestor "k8s_psat" {        plugin_data {          clusters = {            "demo-cluster" = {              service_account_allow_list = ["spire:spire-agent"]            }          }        }      }      KeyManager "memory" {        plugin_data {}      }      UpstreamAuthority "disk" {        plugin_data {          key_file_path = "/run/spire/secrets/bootstrap.key"          cert_file_path = "/run/spire/secrets/bootstrap.crt"        }      }    }---# SPIRE Agent DaemonSet (abbreviated)apiVersion: apps/v1kind: DaemonSetmetadata:  name: spire-agent  namespace: spirespec:  selector:    matchLabels:      app: spire-agent  template:    spec:      containers:        - name: spire-agent          image: ghcr.io/spiffe/spire-agent:1.8.0          volumeMounts:            - name: spire-agent-socket              mountPath: /run/spire/sockets      volumes:        - name: spire-agent-socket          hostPath:            path: /run/spire/sockets            type: DirectoryOrCreate
```
```
# Linkerd enables mTLS automatically# Verify with:# linkerd viz edges deployment -n my-namespace# For external services without mTLSapiVersion: policy.linkerd.io/v1beta1kind: Servermetadata:  name: external-api  namespace: my-namespacespec:  podSelector:    matchLabels:      app: my-app  port: external-api  proxyProtocol: HTTP/1 # or TLS for passthrough---# Skip TLS for specific portapiVersion: v1kind: Servicemetadata:  name: my-service  annotations:    config.linkerd.io/skip-outbound-ports: "3306" # MySQL
```
```
# Linkerd enables mTLS automatically# Verify with:# linkerd viz edges deployment -n my-namespace# For external services without mTLSapiVersion: policy.linkerd.io/v1beta1kind: Servermetadata:  name: external-api  namespace: my-namespacespec:  podSelector:    matchLabels:      app: my-app  port: external-api  proxyProtocol: HTTP/1 # or TLS for passthrough---# Skip TLS for specific portapiVersion: v1kind: Servicemetadata:  name: my-service  annotations:    config.linkerd.io/skip-outbound-ports: "3306" # MySQL
```
```
# Istio - Check certificate expiryistioctl proxy-config secret deploy/my-app -o json | \  jq '.dynamicActiveSecrets[0].secret.tlsCertificate.certificateChain.inlineBytes' | \  tr -d '"' | base64 -d | openssl x509 -text -noout# Force certificate rotationkubectl rollout restart deployment/my-app# Check Linkerd identitylinkerd identity -n my-namespace
```
```
# Istio - Check certificate expiryistioctl proxy-config secret deploy/my-app -o json | \  jq '.dynamicActiveSecrets[0].secret.tlsCertificate.certificateChain.inlineBytes' | \  tr -d '"' | base64 -d | openssl x509 -text -noout# Force certificate rotationkubectl rollout restart deployment/my-app# Check Linkerd identitylinkerd identity -n my-namespace
```
```
# Istio - Check if mTLS is enabledistioctl authn tls-check my-service.my-namespace.svc.cluster.local# Verify peer authenticationkubectl get peerauthentication --all-namespaces# Check destination ruleskubectl get destinationrule --all-namespaces# Debug TLS handshakeistioctl proxy-config log deploy/my-app --level debugkubectl logs deploy/my-app -c istio-proxy | grep -i tls# Linkerd - Check mTLS statuslinkerd viz edges deployment -n my-namespacelinkerd viz tap deploy/my-app --to deploy/my-backend
```
```
# Istio - Check if mTLS is enabledistioctl authn tls-check my-service.my-namespace.svc.cluster.local# Verify peer authenticationkubectl get peerauthentication --all-namespaces# Check destination ruleskubectl get destinationrule --all-namespaces# Debug TLS handshakeistioctl proxy-config log deploy/my-app --level debugkubectl logs deploy/my-app -c istio-proxy | grep -i tls# Linkerd - Check mTLS statuslinkerd viz edges deployment -n my-namespacelinkerd viz tap deploy/my-app --to deploy/my-backend
```
In today's complex microservices architectures, securing communication between internal services is paramount, especially in zero-trust environments. The mTLS Configuration Agent Skill empowers developers to effortlessly implement and manage mutual TLS, ensuring that every service-to-service interaction is authenticated and encrypted. This skill simplifies the often-intricate process of certificate provisioning, rotation, and secure handshake debugging. Leverage its comprehensive guidance to establish robust security postures, meet stringent compliance requirements, and build resilient, impenetrable internal networks. By automating and guiding mTLS setup, this agent skill significantly reduces manual effort and potential misconfigurations, enhancing overall system integrity.

# When to Use This Skill
- •Implementing a new zero-trust network architecture for internal services.
- •Securing communication between microservices within a Kubernetes cluster.
- •Automating certificate issuance and rotation for internal service identities.
- •Meeting regulatory compliance (e.g., PCI-DSS, HIPAA) for data in transit within the organization.

# Pro Tips
- 💡Always automate certificate rotation and renewal to prevent outages and security vulnerabilities.
- 💡Integrate mTLS with a service mesh (e.g., Istio, Linkerd) for fine-grained traffic control and observability.
- 💡Utilize a dedicated secrets management solution (e.g., Vault, AWS Secrets Manager) for storing private keys and CA certificates securely.

