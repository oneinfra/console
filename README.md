# oneinfra console

`oneinfra` console is the Web UI + proxy API to manage `oneinfra`
resources from your browser.

It is tightly tied to the [`oneinfra`
project](https://github.com/oneinfra/oneinfra).


## Developing

In order to launch a local environment you will need to follow these
instructions:

* Run `make run-kind` in the `oneinfra/oneinfra` project
  * This will start a `kind` single control plane cluster, deploying
    all backend required pieces and starting the `oneinfra` controller
    manager as a regular process in your machine. You will need it
    running if you want the reconcile cycles to execute while you
    alter resources.

* Run the `console` API backend
  * Inside the `api` folder execute:

      ```console
      SERVE_ARGS="--auth=kubernetes-secrets" JWT_KEY=thisisaverysecretjwtkey make run
      ```

    Where `JWT_KEY` is a key of your own. If it changes across
      executions, all user sessions will become invalid.

* Run the frontend
  * Inside the `frontend` folder execute: `yarn start`.


If you are going to create clusters, you will need to create some
hypervisors where `oneinfra` will schedule them. You can run the
following command to create some local fake hypervisors:

```console
$ oi-local-hypervisor-set create | kubectl apply -f -
```

This will register the hypervisors in the management Kubernetes
cluster (`kind` in this case).
