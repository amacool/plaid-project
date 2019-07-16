import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, FullColumn } from '../../../components/utility/rowColumn.js';
import Button from '../../../components/uielements/button/index';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import Papersheet from '../../../components/utility/papersheet/index';
import InvoiceAddress from '../../../components/invoice/address';
import InvoicePageWrapper, { PrintIcon } from './singleUser.style';
import connect from "react-redux/es/connect/connect";

class SingleUserView extends Component {
  render() {
    const {currentUser, toggleView, redirectPath } = this.props;
    return (
      <LayoutWrapper>
        <Row>
          <FullColumn>
            <InvoicePageWrapper className="InvoicePageWrapper">
              <div className="PageHeader">
                <Link to={redirectPath}>
                  <Button color="primary">
                    <PrintIcon>call_split</PrintIcon>
                    <span>Go To Users</span>
                  </Button>
                </Link>
                <Button color="secondary" onClick={() => toggleView(true)}>
                  <PrintIcon>mode_edit</PrintIcon>
                  <span>Edit User</span>
                </Button>
              </div>

              <Papersheet>
                <div className="PageContent">
                  <div className="OrderInfo">
                      <div className="LeftSideContent">
                        <h2 className="Title">{currentUser.given_name}</h2>
                      </div>
                    <div className="RightSideContent">
                      <img src={currentUser.picture} alt="Not Found"/>
                    </div>
                  </div>
                  <div className="BillingInformation">
                    <div className="LeftSideContent">
                      <h3 className="Title">Email Address</h3>

                      <InvoiceAddress
                        Name={currentUser.email}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <h3 className="Title">Phone Number</h3>

                      <InvoiceAddress
                        Name={currentUser.phone}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <h3 className="Title">Given Name</h3>

                      <InvoiceAddress
                        Name={currentUser.given_name}
                      />
                    </div>
                    <div className="LeftSideContent">
                      <h3 className="Title">Middle Name</h3>

                      <InvoiceAddress
                        Name={currentUser.middle_name}
                      />
                    </div>
                  </div>
                </div>
              </Papersheet>
            </InvoicePageWrapper>
          </FullColumn>
        </Row>
      </LayoutWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  userList: state.User.userList,
  isLoading: state.User.isLoading
});

const Connect = connect(
  mapStateToProps,
)(SingleUserView);

export default Connect;
