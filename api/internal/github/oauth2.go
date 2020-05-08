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

package github

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/pkg/errors"
	"sigs.k8s.io/yaml"

	"github.com/oneinfra/console/api/internal"
)

var (
	OAUTH2_CLIENT_ID     string = os.Getenv("GITHUB_OAUTH2_CLIENT_ID")
	OAUTH2_CLIENT_SECRET string = os.Getenv("GITHUB_OAUTH2_CLIENT_SECRET")
)

type AccessToken struct {
	AccessToken string `json:"access_token"`
}

type UserUnmarshal struct {
	Id    int    `json:"id"`
	Email string `json:"email"`
}

func retrieveAccessToken(code string) (string, error) {
	url := url.URL{
		Scheme: "https",
		Host:   "github.com",
		Path:   "/login/oauth/access_token",
		RawQuery: fmt.Sprintf(
			"client_id=%s&client_secret=%s&code=%s",
			OAUTH2_CLIENT_ID,
			OAUTH2_CLIENT_SECRET,
			code,
		),
	}
	req, err := http.NewRequest(http.MethodPost, url.String(), nil)
	if err != nil {
		return "", errors.Wrap(err, "could not create request object")
	}
	req.Header.Set("Accept", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", errors.Wrap(err, "could not perform request")
	}
	bodyBytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", errors.Wrap(err, "could not read response body")
	}
	var accessToken AccessToken
	if err := yaml.Unmarshal(bodyBytes, &accessToken); err != nil {
		return "", errors.Wrap(err, "could not unmarshal response")
	}
	return accessToken.AccessToken, nil
}

func retrieveUserWithAccessToken(accessToken string) (internal.User, error) {
	url := url.URL{
		Scheme: "https",
		Host:   "api.github.com",
		Path:   "/user",
	}
	req, err := http.NewRequest(http.MethodGet, url.String(), nil)
	if err != nil {
		return internal.User{}, errors.Wrap(err, "could not create request object")
	}
	req.Header.Set("Authorization", fmt.Sprintf("token %s", accessToken))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return internal.User{}, errors.Wrap(err, "could not perform request")
	}
	bodyBytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return internal.User{}, errors.Wrap(err, "could not read response body")
	}
	var user UserUnmarshal
	if err := yaml.Unmarshal(bodyBytes, &user); err != nil {
		return internal.User{}, errors.Wrap(err, "could not unmarshal response")
	}
	return internal.User{
		Provider: "github",
		Identity: strconv.Itoa(user.Id),
		Email:    user.Email,
	}, nil
}
