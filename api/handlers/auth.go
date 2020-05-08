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
	"net/http"

	"k8s.io/klog"

	"github.com/oneinfra/console/api/internal"
	"github.com/oneinfra/console/api/internal/endpoints/auth"
)

func AuthGithubHandler(w http.ResponseWriter, r *http.Request) {
	user, token, err := auth.Github(r)
	if err != nil {
		klog.Errorf("could not login with github: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if err := internal.EnsureUserNamespace(user.Namespace()); err != nil {
		klog.Errorf("could not ensure user namespace: %q", user.Namespace())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	})
	redirectURI := "/"
	requestQuery := r.URL.Query()
	if requestQuery["redirect"] != nil && len(requestQuery["redirect"]) == 1 {
		redirectURI = requestQuery["redirect"][0]
	}
	http.Redirect(w, r, redirectURI, http.StatusTemporaryRedirect)
}

func AuthKubernetesHandler(w http.ResponseWriter, r *http.Request) {
	user, token, err := auth.Kubernetes(r)
	if err != nil {
		klog.Errorf("could not login with kubernetes: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if err := internal.EnsureUserNamespace(user.Namespace()); err != nil {
		klog.Errorf("could not ensure user namespace: %q", user.Namespace())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	})
	redirectURI := "/"
	requestQuery := r.URL.Query()
	if requestQuery["redirect"] != nil && len(requestQuery["redirect"]) == 1 {
		redirectURI = requestQuery["redirect"][0]
	}
	http.Redirect(w, r, redirectURI, http.StatusTemporaryRedirect)
}
