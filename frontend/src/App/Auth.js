import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { applicationExternalLogin } from '../actions/userActions';

import Modal from "./Modal";
import CodeQuote from "./CodeQuote";

import Api from '../api/api';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.loginUserWithGithub = this.loginUserWithGithub.bind(this);
    this.loginUserWithKubernetes = this.loginUserWithKubernetes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      username: '',
      password: ''
    }
  }

  async loginUserWithGithub() {
    this.props.applicationExternalLogin();
    const loginLink = await Api.githubLoginLink();
    window.location = loginLink;
  }

  async loginUserWithKubernetes() {
    this.props.applicationExternalLogin();
    await Api.kubernetesLogin(this.state.username, this.state.password);
    window.location = '/';
  }

  handleChange(fieldName, event) {
    this.setState({ [fieldName]: event.target.value });
  }

  render() {
    return (
      <div className="vertical-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9 align-self-center">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div className="col-lg-6">
                      <div className="pl-4 pr-4">
                        <div className="p-4 mt-3 mb-3">
                          <div className="text-center">
                            <h1 className="h1 pb-3 text-gray-900">oneinfra console</h1>
                          </div>
                          {window.AUTHENTICATION_METHODS.includes("kubernetes-secrets") &&
                            <div className="shadow card mt-4">
                              <div className="modal fade" id="kubernetesLoginModal" tabIndex="-1" role="dialog" aria-labelledby="kubernetesLoginModal" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title">What is "Login with Kubernetes"?</h5>
                                    </div>
                                    <div className="modal-body">
                                      <p>This method of authentication relies on secrets created on a namespace <CodeQuote>oneinfra-users</CodeQuote>. Every secret in this namespace represents a username that can login through this console interface.</p>
                                      <p className="font-weight-bold">You should never see this login method in production environments. This login method is exclusively for ease of testing oneinfra.</p>
                                      <p>You can create a new user with the the following command:</p>
                                      <textarea className="form-control text-monospace" readOnly value="kubectl create secret generic -n oneinfra-users &lt;username&gt; --from-literal=password=$(htpasswd -bnBC 10 &quot;&quot; &quot;&lt;password&gt;&quot; | tr -d ':\n')" />
                                    </div>
                                    <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header d-flex flex-row align-items-center justify-content-between">
                                <h6 className="mr-auto m-0 font-weight-bold text-primary">Login with Kubernetes</h6>
                                <div className="dropdown no-arrow">
                                  <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                    <div className="dropdown-header">Help</div>
                                    <a className="dropdown-item" data-toggle="modal" data-target="#kubernetesLoginModal" href="#">What is this?</a>
                                  </div>
                                </div>
                              </div>
                              <div className="card-body">
                                <form onSubmit={this.loginUserWithKubernetes}>
                                  <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" className="form-control" id="username" onChange={(event) => this.handleChange('username', event)} />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" onChange={(event) => this.handleChange('password', event)} />
                                  </div>
                                  <a onClick={this.loginUserWithKubernetes} className="btn btn-default btn-primary btn-user btn-block">
                                    <i className="fas fa-sign-in-alt fa-lg fa-fw"></i> Login
                                  </a>
                                  <button type="submit" hidden />
                                </form>
                              </div>
                            </div>}
                          {window.AUTHENTICATION_METHODS.includes("github-oauth") &&
                            <div className="shadow card mt-4">
                              <div className="card-header">
                                <h6 className="mr-auto m-0 font-weight-bold text-primary">Login with Github</h6>
                              </div>
                              <div className="card-body">
                                <a onClick={this.loginUserWithGithub} className="btn btn-default btn-primary btn-user btn-block">
                                  <i className="fab fa-github fa-lg fa-fw"></i> Login
                                </a>
                              </div>
                            </div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    applicationExternalLogin: bindActionCreators(applicationExternalLogin, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Auth);
