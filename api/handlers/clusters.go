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

package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	clusterv1alpha1 "github.com/oneinfra/oneinfra/apis/cluster/v1alpha1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"
	v1 "k8s.io/client-go/tools/clientcmd/api/v1"

	"github.com/oneinfra/console/api/internal"
)

type ClusterRequest struct {
	Name              string `json:"name"`
	KubernetesVersion string `json:"kubernetesVersion"`
	Replicas          int    `json:"replicas"`
}

func ListClusters(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		clusters, err := user.Clusters()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		internal.MarshalResponse(w, clusters)
	})
}

func CreateCluster(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		rawClusterRequest, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var clusterRequest ClusterRequest
		if err := json.Unmarshal(rawClusterRequest, &clusterRequest); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err = user.CreateCluster(
			clusterRequest.Name,
			clusterRequest.KubernetesVersion,
			clusterRequest.Replicas,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	})
}

func UpdateCluster(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		vars := mux.Vars(r)
		rawClusterRequest, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var clusterRequest ClusterRequest
		if err := json.Unmarshal(rawClusterRequest, &clusterRequest); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		cluster, err := user.GetCluster(vars["clusterName"])
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		cluster.Spec.ControlPlaneReplicas = clusterRequest.Replicas
		if err := user.UpdateCluster(cluster); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})
}

func DeleteCluster(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		vars := mux.Vars(r)
		if err := user.DeleteCluster(vars["clusterName"]); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})
}

func DownloadClusterKubeConfig(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		vars := mux.Vars(r)
		cluster, err := user.GetCluster(vars["clusterName"])
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		kubeConfig, err := createKubeConfig(cluster)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		internal.DownloadResponse(w, r, fmt.Sprintf("%s-%s.kubeconfig", cluster.Namespace, cluster.Name), []byte(kubeConfig))
	})
}

func createKubeConfig(cluster *clusterv1alpha1.Cluster) (string, error) {
	adminCertificate, exists := cluster.Status.ClientCertificates["kubernetes-admin"]
	if !exists {
		return "", errors.New("could not find kubernetes admin certificate")
	}
	kubeConfig := v1.Config{
		Clusters: []v1.NamedCluster{
			{
				Name: cluster.Name,
				Cluster: v1.Cluster{
					Server:                   cluster.Status.APIServerEndpoint,
					CertificateAuthorityData: []byte(cluster.Spec.APIServer.CA.Certificate),
				},
			},
		},
		AuthInfos: []v1.NamedAuthInfo{
			{
				Name: cluster.Name,
				AuthInfo: v1.AuthInfo{
					ClientCertificateData: []byte(adminCertificate.Certificate),
					ClientKeyData:         []byte(adminCertificate.PrivateKey),
				},
			},
		},
		Contexts: []v1.NamedContext{
			{
				Name: cluster.Name,
				Context: v1.Context{
					Cluster:  cluster.Name,
					AuthInfo: cluster.Name,
				},
			},
		},
		CurrentContext: cluster.Name,
	}
	return marshalKubeConfig(&kubeConfig)
}

func marshalKubeConfig(kubeConfig *v1.Config) (string, error) {
	scheme := runtime.NewScheme()
	if err := v1.AddToScheme(scheme); err != nil {
		return "", err
	}
	info, _ := runtime.SerializerInfoForMediaType(serializer.NewCodecFactory(scheme).SupportedMediaTypes(), runtime.ContentTypeYAML)
	encoder := serializer.NewCodecFactory(scheme).EncoderForVersion(info.Serializer, v1.SchemeGroupVersion)
	if encodedKubeConfig, err := runtime.Encode(encoder, kubeConfig); err == nil {
		return string(encodedKubeConfig), nil
	}
	return "", errors.New("could not create a kubeconfig")
}
