import React, { Component } from 'react';
import $ from 'jquery';

class Modal extends Component {
  componentDidMount() {
    this.dismissDialog = this.dismissDialog.bind(this);
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.dismissDialog);
  }

  dismissDialog() {
    this.props.noAction();
  }

  render() {
    return (
      <div className="modal fade" ref={modal=> this.modal = modal} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={this.props.yesAction} className={"btn btn-" + this.props.yesColor} data-dismiss="modal">{this.props.yesTitle}</button>
              <button type="button" data-dismiss="modal" className={"btn btn-" + this.props.noColor} data-dismiss="modal">{this.props.noTitle}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal;
