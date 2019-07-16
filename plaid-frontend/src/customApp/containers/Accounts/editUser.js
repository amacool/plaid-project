import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import notification from '../../../components/notification/index';
import Button from '../../../components/uielements/button/index';
import { Row, FullColumn } from '../../../components/utility/rowColumn.js';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import Papersheet from '../../../components/utility/papersheet/index';
import InvoicePageWrapper, {
  PrintIcon,
  Textfield,
} from './singleUser.style';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const checkUser = user => {
  const emptyKeys = [
    'email',
    'given_name',
    'middle_name',
    'phone',
  ];
  const emptyKeysErrors = [
    'Email Address',
    'Given Name',
    'Middle Name',
    'Phone Number',
  ];
  for (let i = 0; i < emptyKeys.length; i++) {
    if (!user[emptyKeys[i]]) {
      return `Please fill in ${emptyKeysErrors[i]}`;
    }
  }
  return '';
};
class SingleUserEdit extends Component {
  onSave = () => {
    const { editableUser, isNewUser, updateUser } = this.props;
    const error = checkUser(editableUser);
    if (error) {
      notification('error', error);
    } else {
      const successMessage = isNewUser
        ? 'A new user added'
        : 'User Updated';
      notification('success', successMessage);
      updateUser(editableUser);
    }
  };
  render() {
    const {
      editableUser,
      isNewUser,
      redirectPath,
      toggleView,
      editUser,
    } = this.props;
    return (
      <LayoutWrapper>
        <Row>
          <FullColumn>
            <InvoicePageWrapper className="InvoicePageWrapper">
              <div className="PageHeader">
                {isNewUser ? (
                  <Link to={redirectPath}>
                    <Button color="primary">
                      <PrintIcon>undo</PrintIcon>
                      <span>Cancel</span>
                    </Button>
                  </Link>
                ) : (
                  <Button variant="raised" onClick={() => toggleView(false)}>
                    <PrintIcon>undo</PrintIcon>
                    <span>Cancel</span>
                  </Button>
                )}

                <Button
                  variant="raised"
                  color="primary"
                  onClick={this.onSave}
                  className="saveBtn"
                >
                  <PrintIcon>print</PrintIcon>
                  <span>Save</span>
                </Button>
              </div>
              <Papersheet>
                <div className="PageContent">
                  <div className="OrderInfo">
                    <div className="LeftSideContent">
                      {editableUser.given_name}
                    </div>
                    <div className="RightSideContent">
                      <div className="RightSideStatus">
                        <img src={editableUser.picture} alt="Not Found"/>
                      </div>
                    </div>
                  </div>
                  <div className="BillingInformation">
                    <div className="LeftSideContent">
                      <Textfield
                        label="Email Address"
                        value={editableUser.email}
                        onChange={event => {
                          editableUser.email = event.target.value;
                          editUser(editableUser);
                        }}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <Textfield
                        label="Phone Number"
                        value={editableUser.phone}
                        onChange={event => {
                          editableUser.phone = event.target.value;
                          editUser(editableUser);
                        }}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <Textfield
                        label="Given Name"
                        value={editableUser.given_name}
                        onChange={event => {
                          editableUser.given_name = event.target.value;
                          editUser(editableUser);
                        }}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <Textfield
                        label="Middle Name"
                        value={editableUser.middle_name}
                        onChange={event => {
                          editableUser.middle_name = event.target.value;
                          editUser(editableUser);
                          }}
                      />
                    </div>
                  </div>
                  <div className="ButtonWrapper" />
                </div>
              </Papersheet>
            </InvoicePageWrapper>
          </FullColumn>
        </Row>
      </LayoutWrapper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SingleUserEdit);
