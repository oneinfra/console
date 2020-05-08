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

package auth

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/oneinfra/console/api/internal"
	"github.com/oneinfra/console/api/internal/kubernetes"
	"github.com/pkg/errors"
)

func Kubernetes(r *http.Request) (internal.User, string, error) {
	loginRequestRaw, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return internal.User{}, "", err
	}
	var loginRequest kubernetes.LoginRequest
	if err := json.Unmarshal(loginRequestRaw, &loginRequest); err != nil {
		return internal.User{}, "", err
	}
	user, err := kubernetes.RetrieveUser(loginRequest)
	if err != nil {
		return internal.User{}, "", errors.Errorf("could not retrieve kubernetes user: %v", err)
	}
	token, err := internal.NewJWT(user)
	if err != nil {
		return internal.User{}, "", err
	}
	return user, token, nil
}
