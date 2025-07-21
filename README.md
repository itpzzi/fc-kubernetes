# Kubernetes Lab - Comandos Essenciais

## Build e Deploy
`docker build -t fc-kubernetes/express-app:v4.0.2 .`  
`kind load docker-image fc-kubernetes/express-app:v4.0.2 --name fc-k8s`  
`kubectl apply -f k8s/express-deployment.yaml`  
`kubectl rollout restart deployment/node-deployment`

## Acesso e Port Forwarding
`kubectl port-forward deployment/node-deployment 3000:3000`

## Monitoramento e Autoscaling
`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`  
`kubectl autoscale deployment node-deployment --cpu-percent=50 --min=1 --max=5`  
`watch -n 3 "kubectl top nodes && kubectl top pods"`

## Testes de Carga
`kubectl run fortio --rm -i --image=fortio/fortio -- load -qps 100 -t 120s -c 50 "http://node-nodeport/probes/healthz"`

## Debugging
`kubectl get events --sort-by='.lastTimestamp'`  
`kubectl get pods -w`  
`kubectl get svc`

## Volumes de Persistência
`kubectl get storageclass`  
`kubectl get pvc`  
`kubectl get pv`  
`kubectl delete pod pvc-pod`  
`kubectl apply -f k8s/persistent-pod.yaml`  
`kubectl exec -it pvc-pod -- cat /data/data.txt`

## Comandos Úteis

### Gerenciamento de Clusters
- `kubectl config current-context` - Ver cluster ativo
- `kubectl config get-contexts` - Listar todos os clusters
- `kubectl config use-context <context>` - Trocar entre clusters
- `kind get clusters` - Listar clusters do Kind
- `k3d cluster list` - Listar clusters do k3d

### Carregamento de Imagens
**Kind:**
- `kind load docker-image <image> --name <cluster-name>` - Carregar imagem no Kind

**k3d:**
- `k3d image import <image> --cluster <cluster-name>` - Carregar imagem no k3d
- k3d image import fc-kubernetes/express-app:v5.1-alpha --cluster istio-lab
k3d cluster create \
  --port 8000:80@loadbalancer

### Informações dos Recursos
- `kubectl describe deployment/<name>` - Detalhes do deployment
- `kubectl describe pod/<name>` - Detalhes do pod
- `kubectl describe svc/<name>` - Detalhes do service
- `kubectl get pods -o wide` - Pods com mais informações
- `kubectl get pods --show-labels` - Pods com labels
- `kubectl get pods -l app=<label>` - Filtrar pods por label

### Logs e Debugging
- `kubectl logs <pod>` - Ver logs do pod
- `kubectl logs <pod> -c <container>` - Logs de container específico
- `kubectl logs -l app=<label>` - Logs de pods com label
- `kubectl logs --previous <pod>` - Logs do container anterior
- `kubectl logs -f <pod>` - Seguir logs em tempo real

### Acesso aos Pods
- `kubectl exec -it <pod> -- sh` - Acessar shell do pod
- `kubectl exec -it <pod> -- bash` - Acessar bash do pod
- `kubectl exec <pod> -- <command>` - Executar comando no pod

### Gerenciamento de Deployments
- `kubectl rollout status deployment/<name>` - Status do rollout
- `kubectl rollout history deployment/<name>` - Histórico de rollouts
- `kubectl rollout undo deployment/<name>` - Desfazer rollout
- `kubectl scale deployment <name> --replicas=<number>` - Escalar deployment

### Networking e Services
- `kubectl get endpoints` - Ver endpoints dos services
- `kubectl get endpoints <service>` - Endpoints específicos
- `kubectl port-forward svc/<service> <local-port>:<service-port>` - Port forward via service

### Recursos e Monitoramento
- `kubectl top nodes` - Uso de recursos dos nodes
- `kubectl top pods` - Uso de recursos dos pods
- `kubectl get hpa` - Horizontal Pod Autoscaler
- `kubectl describe hpa <name>` - Detalhes do HPA

### Troubleshooting
- `kubectl get events --sort-by=.metadata.creationTimestamp` - Eventos ordenados
- `kubectl get pods --field-selector=status.phase=Failed` - Pods com falha
- `kubectl get pods --field-selector=status.phase=Pending` - Pods pendentes
- `kubectl run debug --image=busybox --rm -it --restart=Never -- sh` - Pod debug temporário

### Limpeza
- `kubectl delete pod <pod>` - Deletar pod
- `kubectl delete deployment <name>` - Deletar deployment
- `kubectl delete svc <name>` - Deletar service
- `kubectl delete all -l app=<label>` - Deletar recursos por label
- `kubectl delete all --all` - Deletar todos os recursos (cuidado!)

### Verificação de Configuração
- `kubectl config view` - Ver configuração do kubectl
- `kubectl cluster-info` - Informações do cluster
- `kubectl version` - Versão do kubectl e cluster
- `kubectl api-resources` - Recursos disponíveis na API

### Trabalho com Manifests
- `kubectl apply -f <file>` - Aplicar manifest
- `kubectl delete -f <file>` - Deletar recursos do manifest
- `kubectl get -f <file>` - Ver recursos do manifest
- `kubectl dry-run=client -o yaml` - Testar manifest sem aplicar

### Validação e Troubleshooting
- `kubectl get all` - Ver todos os recursos
- `kubectl get all -n <namespace>` - Recursos por namespace
- `kubectl get pods --all-namespaces` - Pods de todos os namespaces
- `kubectl describe node <node>` - Detalhes do node

### Dashboards
- `istioctl dashboard kiali`

### Validações
curl -s http://localhost:8000/app/version

# Instalar Istio (perfil demo)
istioctl install --set values.defaultRevision=default

# Habilitar injeção automática de sidecar
kubectl label namespace default istio-injection=enabled

# Verificar instalação
kubectl get pods -n istio-system

# Instalar addons (Kiali, Jaeger, Grafana, Prometheus)
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml

# Aguardar pods ficarem prontos
kubectl wait --for=condition=available --timeout=600s deployment/kiali -n istio-system

# Editar serviço de ingress
kubectl edit svc istio-ingressgateway -n istio-system