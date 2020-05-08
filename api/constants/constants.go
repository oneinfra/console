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

package constants

type BuildType string

const (
	OneInfraUsersNamespace string = "oneinfra-users"
)

const (
	Development BuildType = "development"
	Production  BuildType = "production"
)

type AuthenticationMethod string

const (
	KubernetesSecrets AuthenticationMethod = "kubernetes-secrets"
	GithubOAuth       AuthenticationMethod = "github-oauth"
)

var (
	AuthenticationMethods = []AuthenticationMethod{
		KubernetesSecrets,
		GithubOAuth,
	}
)
