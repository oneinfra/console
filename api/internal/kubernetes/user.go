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

package kubernetes

import (
	"context"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/oneinfra/console/api/constants"
	"github.com/oneinfra/console/api/internal"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func RetrieveUser(loginRequest LoginRequest) (internal.User, error) {
	userSecret, err := internal.KubernetesClientset.CoreV1().Secrets(
		constants.OneInfraUsersNamespace,
	).Get(
		context.TODO(),
		loginRequest.Username,
		metav1.GetOptions{},
	)
	if err != nil {
		return internal.User{}, errors.New("could not validate user")
	}
	savedPassword, exists := userSecret.Data["password"]
	if !exists {
		return internal.User{}, errors.New("could not validate user")
	}
	if err := bcrypt.CompareHashAndPassword(savedPassword, []byte(loginRequest.Password)); err != nil {
		return internal.User{}, errors.New("could not validate user")
	}
	return internal.User{
		Provider: "kubernetes",
		Identity: loginRequest.Username,
		Email:    fmt.Sprintf("%s@%s", loginRequest.Username, constants.OneInfraUsersNamespace),
	}, nil
}
