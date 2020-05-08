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
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"

	"github.com/oneinfra/console/api/constants"
	"k8s.io/klog"
)

var (
	indexContents []byte
)

type Handler func(http.ResponseWriter, *http.Request)

func init() {
	var err error
	if constants.BuildMode == constants.Production {
		indexContents, err = ioutil.ReadFile(filepath.Join("/public", "index.html"))
	} else {
		indexContents, err = ioutil.ReadFile(filepath.Join("..", "frontend", "build", "index.html"))
	}
	if err != nil {
		klog.Fatalf("could not read index file: %v", err)
	}
}

func existingAuthenticationMethods() map[constants.AuthenticationMethod]struct{} {
	res := map[constants.AuthenticationMethod]struct{}{}
	for _, authenticationMethod := range constants.AuthenticationMethods {
		res[authenticationMethod] = struct{}{}
	}
	return res
}

func InitAuthenticationMethods(authenticationMethods []string) (map[constants.AuthenticationMethod]struct{}, error) {
	existingAuthenticationMethods := existingAuthenticationMethods()
	res := map[constants.AuthenticationMethod]struct{}{}
	for _, authenticationMethod := range authenticationMethods {
		if _, exists := existingAuthenticationMethods[constants.AuthenticationMethod(authenticationMethod)]; !exists {
			klog.Fatalf("unknown authentication method %q; valid authentication methods: %q", authenticationMethod, constants.AuthenticationMethods)
		}
		res[constants.AuthenticationMethod(authenticationMethod)] = struct{}{}
	}
	authenticationMethodsJson, err := json.Marshal(&authenticationMethods)
	if err != nil {
		return map[constants.AuthenticationMethod]struct{}{}, err
	}
	indexContents = bytes.ReplaceAll(indexContents, []byte("__AUTHENTICATION_METHODS__=[]"), []byte(fmt.Sprintf("__AUTHENTICATION_METHODS__=%s", authenticationMethodsJson)))
	return res, nil
}

func RootHandler(fileServerPath http.Dir, fileServerHandler http.Handler) Handler {
	return func(w http.ResponseWriter, r *http.Request) {
		if fileStat, err := os.Stat(filepath.Join(string(fileServerPath), r.URL.Path)); err == nil {
			if fileStat.Mode().IsRegular() {
				fileServerHandler.ServeHTTP(w, r)
				return
			}
		}
		w.Write(indexContents)
	}
}
