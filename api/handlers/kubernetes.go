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
	"net/http"

	"k8s.io/klog"

	"github.com/oneinfra/console/api/internal"
	"github.com/oneinfra/oneinfra/pkg/constants"
)

type KubernetesVersions struct {
	Default  string   `json:"default"`
	Versions []string `json:"versions"`
}

var (
	kubernetesVersions []byte
)

func init() {
	allVersions := KubernetesVersions{
		Default:  constants.ReleaseData.DefaultKubernetesVersion,
		Versions: []string{},
	}
	for _, version := range constants.ReleaseData.KubernetesVersions {
		allVersions.Versions = append(
			allVersions.Versions,
			version.Version,
		)
	}
	var err error
	kubernetesVersions, err = json.Marshal(allVersions)
	if err != nil {
		klog.Fatalf("could not marshal kubernetes versions: %v", err)
	}
}

func GetKubernetesVersions(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		w.Write(kubernetesVersions)
	})
}
