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
	"github.com/oneinfra/console/api/internal"
)

func RetrieveUser(code string) (internal.User, error) {
	accessToken, err := retrieveAccessToken(code)
	if err != nil {
		return internal.User{}, err
	}
	user, err := retrieveUserWithAccessToken(accessToken)
	if err != nil {
		return internal.User{}, err
	}
	return user, nil
}
