manifests:
	kustomize build config/console/auth/kubernetes-secrets > config/generated/all-kubernetes-secrets.yaml
	kustomize build config/console/auth/github-oauth > config/generated/all-github-oauth.yaml
