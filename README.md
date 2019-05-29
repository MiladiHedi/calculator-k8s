calculator-k8s
=============
[![Build Status](https://travis-ci.org/MiladiHedi/calculator-k8s.svg?branch=master)](https://travis-ci.org/MiladiHedi/calculator-k8s)

The app is a calculator, it calculate two things ,powers and factorial, when you ask a new operation, the app compute and save in redis and persist on postgres. The calculator-daemon request randomly  factorial and power api to load the cluster.(and agrow logs and consumtion) .
With this project you can deploy an react app with minikube and aws, and monitor logs and resources consumtion) with kibana and promotheus/grafana.

## Installation

In this repository  there is two folder on for minikubne (mini-k8s) and an for aws

#### minikube
if you run minkube on a virtual machine (as virtual box), i advise to run : 
```
minikube start --vm-driver=none --apiserver-ips 127.0.0.1 --apiserver-name localhost --extra-config=kubelet.resolv-conf=/run/systemd/resolve/resolv.conf
```
Postgres, api and handler deployments referes to a password so create it :
kubectl create secret generic pgpassword --from-literal PGPASSWORD=my_password

And  run:
```
kubectl apply -f mini-k8s
```
"--validate=false" can be needed, minikube show some eror but in aws I don't have any error.

Then run sudo minikube ip and past it in your browser.

#### AWS

To create my kubernetes cluster, I used kops (https://github.com/kubernetes/kops) 

like with minikube create password and apply kubernetes files.

In adittion in folder k8s_aws there is a folder elk, it deploy fluentd,elastick-search and kibana, to monitor logs of alls containers, as a prod environement.

![image1](https://user-images.githubusercontent.com/41380222/58557884-bd1e7e00-821f-11e9-87e0-a590ad82edc1.JPG)
 *My kibana dashbord with loadind by scaling replicas of calcularot daemon*
 
Then deploy promotheus and grafana. it is not in sources file in this repository.
iI used helm to do this :
```
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh 
chmod +x get_helm.sh 
./get_helm.sh 
```
helm client is installed 
```
touch ~/environment/rbac.yaml
```
put these lines :
```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

apply and init helm :
```
kubectl apply -f rbac.yaml
helm init --service-account tiller --upgrade
helm repo update
```
Get kubernetes chart sources:
```
git clone https://github.com/kubernetes/charts
```
Edit promotheus and grafana configuration as you want:
chart/stable/promotheus/values.yaml
charts/stable/grafana/values.yaml
```
helm install -f charts/stable/prometheus/values.yaml stable/prometheus --name prometheus --namespace monitoring
helm install -f charts/stable/grafana/values.yaml stable/grafana --name grafana --namespace monitoring
```
I Use loadBalancer to access to grafana.
login to grafana and  then  add datasource :

Type: Prometheus

URL: http://<span></span>prometheus-server.monitoring.svc.cluster.local

After that import dashbord from grafana.

![image2](https://user-images.githubusercontent.com/41380222/58557891-c0b20500-821f-11e9-9e68-4ad845bcce50.JPG)
 *My grafana dashbord with loadind by scaling replicas of calcularot daemon*
