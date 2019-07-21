import React, { Component } from 'react';
import {connect} from 'react-redux';
import Papersheet from '../../../components/utility/papersheet';
import {
  Row,
  HalfColumn,
} from '../../../components/utility/rowColumn';
import {Typography} from "../../../containers/UiElements/Cards/card.style";
import styled from "styled-components";
const HeadingTypography = styled(Typography)`
  font-size: 15px !important;
  margin-bottom: 10px !important;
`;
const BodyTypography = styled(Typography)`
  font-size: 18px !important;
`;

class accountDetail extends Component {
  render() {
    let {accountList} = this.props;
    let accountId = this.props.match.params.accountId;
    let account = accountList.filter(item => item.account_id === accountId)[0];
    let balance = account.balances;
    
    return (
      <Row style={{ margin: '0' }}>
        <HalfColumn style={{maxWidth: '49%'}}>
          <Papersheet title="Account Information" style={{ height: '89vh' }}>
            <HeadingTypography component="p">
              Account Id
            </HeadingTypography>
            <BodyTypography component="p">
              {account.account_id}
            </BodyTypography>

            <HeadingTypography type="headline" component="p">
              Name
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {account.name}
            </BodyTypography>

            <HeadingTypography type="headline" component="p">
              Mask
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {account.mask}
            </BodyTypography>

            <HeadingTypography type="headline" component="p">
              Official Name
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {account.official_name}
            </BodyTypography>

            <HeadingTypography type="headline" component="p">
              Subtype
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {account.subtype}
            </BodyTypography>

            <HeadingTypography type="headline" component="p">
              Type
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {account.type}
            </BodyTypography>
          </Papersheet>
        </HalfColumn>
    
        <HalfColumn style={{maxWidth: '49%'}}>
          <Papersheet title="Account Balance" style={{ height: '89vh' }}>
            <HeadingTypography type="headline" component="p">
              Available
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {balance.available}
            </BodyTypography>
  
            <HeadingTypography type="headline" component="p">
              Name
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {balance.current}
            </BodyTypography>
  
            <HeadingTypography type="headline" component="p">
              Limit
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {balance.limit}
            </BodyTypography>
  
            <HeadingTypography type="headline" component="p">
              Currency
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {balance.iso_currency_code}
            </BodyTypography>
  
            <HeadingTypography type="headline" component="p">
              Unofficial Currency
            </HeadingTypography>
            <BodyTypography type="body1" className="pos">
              {balance.unofficial_currency_code}
            </BodyTypography>
          </Papersheet>
        </HalfColumn>
      </Row>
    )
  }
}


const mapStateToProps = (state) => ({
  accountList: state.Plaid.accountList,
  accessToken: state.Plaid.accessToken,
  isAuthenticating: state.Plaid.isAuthenticating,
  currentUser: state.User.currentUser,
});

const Connect = connect(
  mapStateToProps,
  null
)(accountDetail);

export default Connect;
