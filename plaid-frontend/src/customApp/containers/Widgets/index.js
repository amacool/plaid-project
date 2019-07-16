import React, {Component} from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import {
  Row,
  TwoThirdColumn
} from '../../../components/utility/rowColumn';
import Visitors from './Visitors/index';
import {DemoWrapper} from "../../../components/utility/papersheet";
import Loader from "../../../components/utility/Loader";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import userActions from "../../../redux/user/actions";

class Widget extends Component {
  componentDidMount() {
    this.props.getUserList({pageNum: 1, itemsPerPage: 10, dashboard: true});
  }
  render() {
    const {isLoading} = this.props;
    if (isLoading ) {
      return (
        <DemoWrapper>
          <Loader />
        </DemoWrapper>
      );
    }
    return (
      <LayoutWrapper>

        <Row>
          <TwoThirdColumn md={12}>
            <Visitors title="Users of the Year" stretched/>
          </TwoThirdColumn>
        </Row>
      </LayoutWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  usersState: state.User.usersState,
  isLoading: state.User.isLoading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({
      getUserList: userActions.getUserList
    }, dispatch)
  }
};

const Connect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Widget);

export default Connect;
