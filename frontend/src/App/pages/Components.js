import React, { Component } from 'react';

import CodeQuote from '../CodeQuote';

import { componentIcon } from '../../lib/components';

class Components extends Component {
  render() {
    return (
        <table className={"table" + ((this.props.components.length > 0) ? " table-hover" : "")}>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Hypervisor</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            {this.props.components.length > 0
               ? this.props.components.map((component, index) => {
                   return (
                     <tr key={index}>
                       <td className="text-center align-middle"><i className={"fas fa-lg text-primary " + componentIcon(component)} /></td>
                       <td className="align-middle">{component.metadata.name}</td>
                       <td className="align-middle"><CodeQuote>{component.spec.role}</CodeQuote></td>
                       <td className="align-middle">{component.spec.hypervisor || "Unassigned yet"}</td>
                       <td className="align-middle">{component.metadata.creationTimestamp}</td>
                     </tr>
                   )
                 })
               : <tr>
                   <td className="text-center" colSpan="42">
                     <p className="p-2">No components present yet.</p>
                   </td>
                 </tr>
            }
          </tbody>
        </table>
    );
  }
}

export default Components;
