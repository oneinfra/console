FROM oneinfra/builder:latest as go-builder
RUN mkdir -p /console
WORKDIR /console
COPY api/go.mod go.mod
COPY api/go.sum go.sum
COPY api/vendor/ vendor/
COPY api/main.go main.go
COPY api/constants/ constants/
COPY api/internal/ internal/
COPY api/handlers/ handlers/
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GO111MODULE=on go install -tags production -mod=vendor github.com/oneinfra/console/api

FROM node:13-alpine as yarn-builder
RUN mkdir -p /console
WORKDIR /console
COPY frontend/ .
RUN yarn build

FROM gcr.io/distroless/static:nonroot
WORKDIR /
COPY --from=go-builder /go/bin/api .
COPY --from=yarn-builder /console/build/ /public/
USER nonroot:nonroot

ENTRYPOINT ["/api"]