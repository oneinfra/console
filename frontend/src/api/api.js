class Api {
  static githubLoginLink() {
    return Api.fetch('/api/login/github').catch(error => () => {
      throw(error);
    }).then(res => res.json()).catch(error => () => {
      throw(error);
    }).then(json => json.url)
  }

  static kubernetesLogin(username, password) {
    return Api.fetch('/api/auth/kubernetes', 'post', {
      username,
      password
    }).catch(error => () => {
      throw(error);
    })
  }

  static getUser() {
    return Api.fetchWithAuth('/api/user').catch(error => () => {
      throw(error);
    }).then(res => res.json()).catch(error => () => {
      throw(error);
    }).then(json => json.email)
  }

  static logoutUser() {
    return Api.fetchWithAuth('/api/session', 'delete').catch(error => () => {
      throw(error);
    });
  }

  static getAllKubernetesVersions() {
    return Api.fetchWithAuth('/api/kubernetes-versions').catch(error => () => {
      throw(error);
    }).then(res => res.json()).catch(error => () => {
      throw(error);
    })
  }

  static getAllClusters() {
    return Api.fetchWithAuth('/api/clusters').catch(error => () => {
      throw(error);
    }).then(res => res.json()).catch(error => () => {
      throw(error);
    }).then(json => json.items)
  }

  static createCluster(clusterName, kubernetesVersion, replicas) {
    return Api.fetchWithAuth(`/api/clusters`, 'post', {
      name: clusterName,
      kubernetesVersion: kubernetesVersion,
      replicas: replicas
    }).catch(error => () => {
      throw(error);
    })
  }

  static updateCluster(clusterName, replicas) {
    return Api.fetchWithAuth(`/api/clusters/${clusterName}`, 'put', {
      replicas: replicas
    }).catch(error => () => {
      throw(error);
    })
  }

  static deleteCluster(clusterName) {
    return Api.fetchWithAuth(`/api/clusters/${clusterName}`, 'delete').catch(error => () => {
      throw(error);
    })
  }

  static updateClusterJoinTokens(clusterName, joinTokens) {
    return Api.fetchWithAuth(`/api/clusters/${clusterName}/join-tokens`, 'put', { joinTokens }).catch(error => () => {
      throw(error);
    })
  }

  static getClusterComponents(clusterName) {
    return Api.fetchWithAuth(`/api/clusters/${clusterName}/components`).catch(error => () => {
      throw(error);
    }).then(res => res.json()).catch(error => () => {
      throw(error);
    }).then(json => json.items)
  }

  static fetch(path, method = 'get', payload) {
    var request = {
      credentials: 'same-origin',
      method: method,
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
      }
    }
    if (typeof payload !== 'undefined') {
      request.headers['Content-Type'] = 'application/json';
      request.body = JSON.stringify(payload);
    }
    return fetch(path, request)
  }

  static fetchWithAuth(path, method = 'get', payload) {
    return fetch(path, {
      credentials: 'same-origin',
      method: method,
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
  }
}

export default Api;
