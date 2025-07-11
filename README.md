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
- `kubectl describe deployment/<name>` - Detalhes do deployment  
- `kubectl logs <pod>` - Ver logs do pod  
- `kubectl exec -it <pod> -- sh` - Acessar shell do pod  