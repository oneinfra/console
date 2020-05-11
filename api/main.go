/**
 * Copyright 2020 Rafael Fernández López <ereslibre@ereslibre.es>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/mux"
	"github.com/urfave/cli/v2"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/klog"

	"github.com/oneinfra/console/api/constants"
	"github.com/oneinfra/console/api/handlers"
	"github.com/oneinfra/console/api/internal"
	"github.com/oneinfra/console/api/internal/endpoints/auth"
	oneinfra "github.com/oneinfra/oneinfra/pkg/clientset/manager"
)

func init() {
	homeKubeConfigPath := filepath.Join(os.Getenv("HOME"), ".kube", "config")
	var config *rest.Config
	var err error
	if kubeConfigPath := os.Getenv("KUBECONFIG"); len(kubeConfigPath) > 0 {
		config, err = clientcmd.BuildConfigFromFlags("", kubeConfigPath)
		klog.Infof("using kubeconfig from local path %s", kubeConfigPath)
	} else if _, err := os.Stat(homeKubeConfigPath); err == nil {
		config, err = clientcmd.BuildConfigFromFlags("", homeKubeConfigPath)
		klog.Infof("using kubeconfig from local path %s", homeKubeConfigPath)
	} else {
		config, err = rest.InClusterConfig()
		if err != nil {
			klog.Fatalf("failed to fetch in-cluster configuration: %v", err)
		}
		klog.Infof("using in-cluster configuration")
	}
	internal.KubernetesClientset, err = kubernetes.NewForConfig(config)
	if err != nil {
		klog.Fatalf("failed to create a Kubernetes clientset: %v", err)
	}
	internal.OneInfraClientset, err = oneinfra.NewForConfig(config)
	if err != nil {
		klog.Fatalf("failed to create a oneinfra clientset: %v", err)
	}
}

func serve(requestedAuthenticationMethods []string) error {
	r := mux.NewRouter()

	authenticationMethods, err := handlers.InitAuthenticationMethods(requestedAuthenticationMethods)
	if err != nil {
		klog.Fatalf("could not initialize authentication methods: %v", err)
	}

	if _, hasGithub := authenticationMethods[constants.GithubOAuth]; hasGithub {
		r.HandleFunc("/api/login/github", handlers.LoginGithubHandler).Methods(http.MethodGet)
		r.HandleFunc("/api/auth/github", handlers.GenericAuthHandler(auth.Github)).Methods(http.MethodGet)
	}
	if _, hasKubernetesSecrets := authenticationMethods[constants.KubernetesSecrets]; hasKubernetesSecrets {
		r.HandleFunc("/api/auth/kubernetes", handlers.GenericAuthHandler(auth.Kubernetes)).Methods(http.MethodPost)
	}
	r.HandleFunc("/api/session", handlers.DeleteSession).Methods(http.MethodDelete)
	r.HandleFunc("/api/user", handlers.GetUser).Methods(http.MethodGet)
	r.HandleFunc("/api/kubernetes-versions", handlers.GetKubernetesVersions).Methods(http.MethodGet)
	r.HandleFunc("/api/clusters", handlers.ListClusters).Methods(http.MethodGet)
	r.HandleFunc("/api/clusters", handlers.CreateCluster).Methods(http.MethodPost)
	r.HandleFunc("/api/clusters/{clusterName}", handlers.UpdateCluster).Methods(http.MethodPut, http.MethodPatch)
	r.HandleFunc("/api/clusters/{clusterName}", handlers.DeleteCluster).Methods(http.MethodDelete)
	r.HandleFunc("/api/clusters/{clusterName}/kubeconfig", handlers.DownloadClusterKubeConfig).Methods(http.MethodGet)
	r.HandleFunc("/api/clusters/{clusterName}/components", handlers.ListComponents).Methods(http.MethodGet)
	r.HandleFunc("/api/clusters/{clusterName}/join-tokens", handlers.UpdateJoinTokens).Methods(http.MethodPut, http.MethodPatch)

	fileServerPath := http.Dir("/public")
	if constants.BuildMode != constants.Production {
		fileServerPath = http.Dir("../frontend/build")
	}
	fileServerHandler := http.FileServer(fileServerPath)
	r.PathPrefix("/").HandlerFunc(handlers.RootHandler(fileServerPath, fileServerHandler)).Methods(http.MethodGet)

	srv := &http.Server{
		Handler:      r,
		Addr:         ":9000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	return srv.ListenAndServe()
}

func main() {
	app := &cli.App{
		Usage: "console server",
		Commands: []*cli.Command{
			{
				Name:  "serve",
				Usage: "serve",
				Flags: []cli.Flag{
					&cli.StringSliceFlag{
						Name:  "auth",
						Usage: fmt.Sprintf("authentication method to use, can be provided several times. Allowed values: %s", constants.AuthenticationMethods),
					},
				},
				Action: func(c *cli.Context) error {
					return serve(c.StringSlice("auth"))
				},
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
