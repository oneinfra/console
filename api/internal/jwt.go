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
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
)

var (
	JWT_KEY string = os.Getenv("JWT_KEY")
)

type JWTClaims struct {
	Provider     string `json:"provider"`
	UserIdentity string `json:"userIdentity"`
	UserEmail    string `json:"userEmail"`
}

func (claims JWTClaims) Valid() error {
	return nil
}

func NewJWT(user User) (string, error) {
	claims := JWTClaims{
		Provider:     user.Provider,
		UserIdentity: user.Identity,
		UserEmail:    user.Email,
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(JWT_KEY))
}

func AuthenticateToken(token string) (User, error) {
	parsedToken, err := jwt.ParseWithClaims(token, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(JWT_KEY), nil
	})
	if err != nil {
		return User{}, errors.Wrap(err, "could not parse token")
	}
	if claims, ok := parsedToken.Claims.(*JWTClaims); ok && parsedToken.Valid {
		return User{
			Provider: claims.Provider,
			Identity: claims.UserIdentity,
			Email:    claims.UserEmail,
		}, nil
	}
	return User{}, errors.New("user not authenticated")
}
