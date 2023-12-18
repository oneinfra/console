module github.com/oneinfra/console/api

go 1.14

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gorilla/mux v1.7.4
	github.com/oneinfra/oneinfra v0.0.0-20200512173005-c13efb1384f6
	github.com/pkg/errors v0.9.1
	github.com/urfave/cli/v2 v2.2.0
	golang.org/x/crypto v0.17.0
	k8s.io/api v0.20.0
	k8s.io/apimachinery v0.20.0
	k8s.io/client-go v0.20.0
	k8s.io/cluster-bootstrap v0.18.2
	k8s.io/klog v1.0.0
	sigs.k8s.io/yaml v1.2.0
)
