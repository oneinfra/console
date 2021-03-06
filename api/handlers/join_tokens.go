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
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	bootstraptokenutil "k8s.io/cluster-bootstrap/token/util"

	"github.com/oneinfra/console/api/internal"
)

type JoinTokens struct {
	JoinTokens []string `json:"joinTokens"`
}

func UpdateJoinTokens(w http.ResponseWriter, r *http.Request) {
	internal.WithAuthenticatedRequest(w, r, func(user internal.User) {
		vars := mux.Vars(r)
		cluster, err := user.GetCluster(vars["clusterName"])
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		rawTokens, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var joinTokens JoinTokens
		if err := json.Unmarshal(rawTokens, &joinTokens); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		filteredJoinTokens := []string{}
		for _, joinToken := range joinTokens.JoinTokens {
			if bootstraptokenutil.IsValidBootstrapToken(joinToken) {
				filteredJoinTokens = append(filteredJoinTokens, joinToken)
			}
		}
		cluster.Spec.JoinTokens = filteredJoinTokens
		if err := user.UpdateCluster(cluster); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})
}
