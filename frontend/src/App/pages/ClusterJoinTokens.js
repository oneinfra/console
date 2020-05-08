import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CodeQuote from '../CodeQuote';

import { updateClusterJoinTokens } from '../../actions/clusterActions';

class ClusterJoinTokens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.switchIsEditing = this.switchIsEditing.bind(this);
    this.applyJoinTokens = this.applyJoinTokens.bind(this);
  }

  switchIsEditing() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  applyJoinTokens(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.updateClusterJoinTokens(
      this.props.clusterName,
      data.get("tokens").split("\n").map(el => el.trim())
    );
    this.setState({ isEditing: false });
  }

  render() {
    return (
      <>
        <div className="modal fade" id="joinTokensModal" tabIndex="-1" role="dialog" aria-labelledby="joinTokensModal" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">What are join tokens?</h5>
              </div>
              <div className="modal-body">
                <p>Join tokens allow you to safely join worker nodes to a managed cluster.</p>
                <p>They are used in order for new worker nodes to initialize the join process and create a <CodeQuote>NodeJoinRequest</CodeQuote> resource in the managed cluster.</p>
                <p>Join tokens are meant to be short-lived and ideally created and destroyed on demand. A join token is only required to exist when the join process starts and until it finishes (when the worker node has successfully joined the cluster).</p>
                <p>A single join token can be reused for joining several worker nodes, but it is recommended to use one join token per worker node.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="mr-auto m-0 font-weight-bold text-primary">Join tokens ({this.props.currentJoinTokens.length})</h6>
            {this.state.isEditing
             ? <>
                 <a onClick={this.switchIsEditing} className="d-none ml-2 d-sm-inline-block btn btn-sm btn-secondary shadow-sm"><i className="fas fa-times-circle fa-sm text-white-50"></i> Cancel</a>
                 <button type="submit" form="cluster-join-tokens" className="d-none ml-2 d-sm-inline-block btn btn-sm btn-success shadow-sm"><i className="fas fa-check-circle fa-sm text-white-50"></i> Apply</button>
               </>
             : <>
                 <div className="dropdown no-arrow">
                   <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                     <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                   </a>
                   <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                     <div className="dropdown-header">Help</div>
                     <a className="dropdown-item" data-toggle="modal" data-target="#joinTokensModal" href="#">What are join tokens?</a>
                   </div>
                 </div>
                 <a onClick={this.switchIsEditing} className="d-none ml-2 d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-edit fa-sm text-white-50"></i> Edit</a>
               </>}
          </div>
          <div className="card-body">
            {this.state.isEditing
             ? <>
                 <p>
                   You can generate random tokens by running <CodeQuote>oi join-token generate</CodeQuote> in your terminal. Provide one token per line.
                 </p>
                 <p>
                   Tokens with an invalid format will be automatically filtered.
                 </p>
                 <p>
                   Removing tokens from the text field will delete them from the cluster.
                 </p>
                 <form id="cluster-join-tokens" onSubmit={this.applyJoinTokens}>
                   <textarea name="tokens" className="text-monospace form-control" rows="6" defaultValue={this.props.currentJoinTokens.map((joinToken, index) => { return joinToken }).join("\n")} />
                 </form>
               </>
             : <>
                 <p>Join tokens allow you to join new worker nodes to this cluster.</p>
                 {(this.props.currentJoinTokens.length > 0)
                   ? <span>
                       <p>These are the current join tokens in this cluster:</p>
                       <ul>
                         {this.props.currentJoinTokens.map((joinToken) => <li key={joinToken}><CodeQuote>{joinToken}</CodeQuote></li>)}
                       </ul>
                     </span>
                   : <p className="font-weight-bold">There are no join tokens present in this cluster at this time.</p>
                  }
                  <p>
                    Join tokens are only required during an active node join. You can have as many join tokens as you want.
                  </p>
                  <p>
                    It is recommended to create them on demand when joining new nodes, and delete them after nodes have joined.
                  </p>
               </>
            }
          </div>
        </div>
      </>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateClusterJoinTokens: bindActionCreators(updateClusterJoinTokens, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ClusterJoinTokens);
