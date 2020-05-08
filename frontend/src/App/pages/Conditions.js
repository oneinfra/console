import React, { Component } from 'react';

class Conditions extends Component {
  render() {
    return (
        <table className={"table" + ((this.props.conditions.length > 0) ? " table-hover" : "")}>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Set</th>
              <th scope="col">Transitioned</th>
            </tr>
          </thead>
          <tbody>
            {this.props.conditions.length > 0
              ? this.props.conditions.map((condition, index) => {
                  return (
                    <tr key={index}>
                      <td className="align-middle">{condition.type}</td>
                      <td className="align-middle">{condition.status}</td>
                      <td className="align-middle">{condition.lastSetTime}</td>
                      <td className="align-middle">{condition.lastTransitionTime}</td>
                    </tr>
                  )
                })
             : <tr>
                 <td className="text-center" colSpan="42">
                   <p className="p-2">No conditions present yet.</p>
                 </td>
               </tr>
            }
          </tbody>
        </table>
    );
  }
}

export default Conditions;
