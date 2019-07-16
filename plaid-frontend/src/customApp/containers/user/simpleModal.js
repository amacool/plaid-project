import React from 'react';
import Typography from '../../../components/uielements/typography';
import Modal from '../../../components/uielements/modals';
import Button from "../../../components/uielements/button";

function getModalStyle() {
  return {
    position: 'absolute',
    width: 200,
    top: '40%',
    left: '50%',
    transform: `translate('-50%', '-50%')`,
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    padding: 16
  };
}

class SimpleModal extends React.Component {
  state = {
    open: false,
  };

  render() {
    const {eventCloseModal, DeleteEventModal} = this.props
    return (
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={true}
        >
          <div style={getModalStyle()}>
            <Typography
              type="title"
              id="modal-title"
              style={{fontSize: '16px', textAlign: 'center'}}
            >
              Are You Sure?
            </Typography>
            <Button
              color="primary"
              className="mateUserView "
              onClick={() => DeleteEventModal(false)}
              style={{float: 'left', paddingBottom: '0px'}}
            >
              Yes
            </Button>
            <Button
              color="primary"
              className="mateUserView "
              onClick={() => eventCloseModal(false)}
              style={{float: 'right', paddingBottom: '0px'}}
            >
              Cancel
            </Button>
          </div>
        </Modal>
    );
  }
}

export default SimpleModal;
