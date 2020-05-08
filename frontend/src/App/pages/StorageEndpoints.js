import React, { Component } from 'react';

import CodeQuote from "../CodeQuote";

class StorageEndpoints extends Component {
  render() {
    const storagePeerEndpoints = this.props.storagePeerEndpoints || []
    const storageClientEndpoints = this.props.storageClientEndpoints || []
    return (
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="mr-auto m-0 font-weight-bold text-primary">Storage endpoints</h6>
        </div>
        <div className="card-body">
          <p>Storage endpoints are where control plane instances persist their data. This card is solely for informational purposes. The platform will manage these endpoints automatically.</p>
          <div className="card mb-4">
            <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
              <h6 className="mr-auto m-0 font-weight-bold text-primary">Peer endpoints</h6>
            </div>
            <div className="card-body">
              <p>Peer endpoints are used for server to server communication in the storage layer.</p>
              <ul className="mb-0">
                { Object.entries(storagePeerEndpoints).length > 0
                  ? Object.entries(storagePeerEndpoints).map(endpoint => <li key={endpoint[0]}><CodeQuote>{endpoint[0]}</CodeQuote><ul><li key={endpoint[1]}><CodeQuote>{endpoint[1]}</CodeQuote></li></ul></li>)
                  : <li>There are no storage peer endpoints published yet.</li> }
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
              <h6 className="mr-auto m-0 font-weight-bold text-primary">Client endpoints</h6>
            </div>
            <div className="card-body">
              <p>Client endpoints are used for client to server communication in the storage layer.</p>
              <ul className="mb-0">
                { Object.entries(storageClientEndpoints).length > 0
                  ? Object.entries(storageClientEndpoints).map(endpoint => <li key={endpoint[0]}><CodeQuote>{endpoint[0]}</CodeQuote><ul><li key={endpoint[1]}><CodeQuote>{endpoint[1]}</CodeQuote></li></ul></li>)
                  : <li>There are no client peer endpoints published yet.</li> }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StorageEndpoints;
