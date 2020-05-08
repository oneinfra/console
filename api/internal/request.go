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
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

type RequestHandler func(user User)

func WithAuthenticatedRequest(w http.ResponseWriter, r *http.Request, requestHandler RequestHandler) {
	user, err := authenticateRequest(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	requestHandler(user)
}

func MarshalResponse(w http.ResponseWriter, response interface{}) {
	marshaledResponse, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(marshaledResponse)
}

func DownloadResponse(w http.ResponseWriter, r *http.Request, fileName string, contents []byte) {
	w.Header().Add("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	http.ServeContent(w, r, fileName, time.Time{}, bytes.NewReader(contents))
}

func authenticateRequest(r *http.Request) (User, error) {
	cookieToken, err := r.Cookie("token")
	if err != nil {
		return User{}, errors.New("unrecognized token")
	}
	return AuthenticateToken(cookieToken.Value)
}
