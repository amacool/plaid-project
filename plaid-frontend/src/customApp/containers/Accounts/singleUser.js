import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditInvoice from './editUser';
import ViewInvoice from './viewUser';
import Loader from '../../../components/utility/Loader/index';
import userActions from '../../../redux/user/actions';

class SingleUser extends Component {
  componentDidMount() {
    const {initialUserList, initData} = this.props;
    if (!initialUserList) {
      initData();
    }
  }
  render() {
    const { match, currentUser, enableEditView } = this.props;
    const redirectPath = match.url.replace(match.params.userId, '');
    if (currentUser.id !== match.params.userId) {
      return <Loader />;
    } else if (enableEditView) {
      return <EditInvoice {...this.props} redirectPath={redirectPath} />;
    } else {
      return <ViewInvoice {...this.props} redirectPath={redirectPath} />;
    }
  }
}
function mapStateToProps(state) {
  return {
    ...state.User
  };
}

export default connect(mapStateToProps, userActions)(SingleUser);
