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

package internal

import (
	"context"
	"fmt"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	clusterv1alpha1 "github.com/oneinfra/oneinfra/apis/cluster/v1alpha1"
	"github.com/oneinfra/oneinfra/pkg/constants"
	"github.com/pkg/errors"
)

func (user User) Clusters() (*clusterv1alpha1.ClusterList, error) {
	return OneInfraClientset.ClusterV1alpha1().Clusters(
		user.Namespace(),
	).List(
		context.TODO(),
		metav1.ListOptions{},
	)
}

func (user User) CreateCluster(name, kubernetesVersion string, replicas int) error {
	_, err := OneInfraClientset.ClusterV1alpha1().Clusters(
		user.Namespace(),
	).Create(
		context.TODO(),
		&clusterv1alpha1.Cluster{
			ObjectMeta: metav1.ObjectMeta{
				Name:      name,
				Namespace: user.Namespace(),
			},
			Spec: clusterv1alpha1.ClusterSpec{
				KubernetesVersion:    kubernetesVersion,
				ControlPlaneReplicas: replicas,
			},
		},
		metav1.CreateOptions{},
	)
	return err
}

func (user User) GetCluster(clusterName string) (*clusterv1alpha1.Cluster, error) {
	clusters, err := user.Clusters()
	if err != nil {
		return nil, err
	}
	for _, cluster := range clusters.Items {
		if cluster.Name == clusterName {
			return &cluster, nil
		}
	}
	return nil, errors.Errorf("cluster %q not found", clusterName)
}

func (user User) UpdateCluster(cluster *clusterv1alpha1.Cluster) error {
	_, err := OneInfraClientset.ClusterV1alpha1().Clusters(
		user.Namespace(),
	).Update(
		context.TODO(),
		cluster,
		metav1.UpdateOptions{},
	)
	return err
}

func (user User) DeleteCluster(clusterName string) error {
	return OneInfraClientset.ClusterV1alpha1().Clusters(
		user.Namespace(),
	).Delete(
		context.TODO(),
		clusterName,
		metav1.DeleteOptions{},
	)
}

func (user User) ClusterComponents(clusterName string) (*clusterv1alpha1.ComponentList, error) {
	return OneInfraClientset.ClusterV1alpha1().Components(
		user.Namespace(),
	).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", constants.OneInfraClusterNameLabelName, clusterName),
		},
	)
}
