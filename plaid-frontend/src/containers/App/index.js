import React, { Component } from 'react';
import { connect } from 'react-redux';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import plaidActions from '../../redux/plaid/actions';
import themeActions from '../../redux/themeSwitcher/actions';
import './global.css';
import Loader from "../../components/utility/Loader";
import {DemoWrapper} from "../../components/utility/papersheet";
import Cookies from "universal-cookie";
import notification from "../../components/notification";
import Topbar from "../Topbar";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import {getPaypalConfig} from "../../redux/paypal/saga";
import {setupPayment} from "../../redux/paypal/saga";
import {executePayment} from "../../redux/paypal/saga";

const cookies = new Cookies();
const { logout } = authAction;
const { toggleAll } = appActions;
const { switchActivation } = themeActions;
const { getPlaidAccessToken, getPlaidPublicToken, getPlaidAssetReportToken, getAccountInfo, getAccountInfo1 } = plaidActions;

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAppLoading: true,
			total: 0,
      payStatus: false,
			payment: {}
		};
		this.timer = null;
		this.interval = 5000;
    this.paypalMode = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PAYPAL_MODE : process.env.REACT_APP_PAYPAL_MODE_DEV;
    this.paypalCurrency = 'USD';
    this.clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    this.paypalSetting = {
      sandbox:    process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PAYPAL_SANDBOX_ID : process.env.REACT_APP_PAYPAL_SANDBOX_ID_DEV,
      production: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PAYPAL_LIVE_ID : process.env.REACT_APP_PAYPAL_LIVE_ID_DEV,
    }
	}
	
	componentDidMount() {
    const accessToken = cookies.get('accessToken');
    const assetReportToken = cookies.get('assetReportToken');
    if (!accessToken || !assetReportToken) {
      console.log('getting token...');
    	this.props.getPlaidPublicToken();
    } else {
      this.props.getAccountInfo1({accessToken, assetReportToken});
      notification('info', 'Connected successfully!');
      this.setState({isAppLoading: false});
		}
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = `www.paypal.com/sdk/js?client-id=${this.clientId}`;
    document.getElementsByTagName('body').appendChild(tag);
    this.props.getPaypalConfig();
	}
	
	componentWillReceiveProps(nextProps) {
    const accessToken = cookies.get('accessToken');
    const assetReportToken = cookies.get('assetReportToken');
    if (nextProps.plaidPublicToken && this.props.plaidPublicToken !== nextProps.plaidPublicToken && !this.props.plaidAccessToken) {
    	// right after getting public token, get access token
      this.props.getPlaidAccessToken(nextProps.plaidPublicToken);
      
    } else if (!this.props.isAuthenticatingCancelled && nextProps.isAuthenticatingCancelled) {
      // user cancelled plaid authenticating
      clearTimeout(this.timer);
      this.props.getPlaidPublicToken();
      
    } else if (this.props.plaidAccessToken !== nextProps.plaidAccessToken) {
    	// after getting access token, get asset report token
      console.log('getting asset report token ...', accessToken);
      this.props.getPlaidAssetReportToken({accessToken, publicToken: this.props.plaidPublicToken});
      
    } else if (this.props.plaidAssetReportToken !== nextProps.plaidAssetReportToken) {
      // after getting asset report token, get account info
      this.props.getAccountInfo1({accessToken, assetReportToken});
      notification('info', 'Connected successfully!');
      this.setState({isAppLoading: false});
      
		} else if (this.props.publicToken && accessToken && !assetReportToken) {
    	// if previous request to get asset token was failed, here again...
      console.log('getting asset report token ...', accessToken);
      this.props.getPlaidAssetReportToken({accessToken, publicToken: this.props.plaidPublicToken});
      
		} else if (this.props.stateAssetReportToken === 0) {
    	// failed to get asset report token (& update item)
      this.props.getPlaidAssetReportToken({accessToken, publicToken: this.props.plaidPublicToken});
		}
	}

  paypalOnSuccess = (payment) => {
		this.props.executePayment(payment);
	};
	
	render() {
		const {isPlaidAuthenticating} = this.props;
		return (
		  <div style={{textAlign: 'center', padding: '80px 50px 0', lineHeight: '55px'}}>
        <Topbar />

        <PaypalExpressBtn
					env={this.paypalMode}
					client={this.paypalSetting}
					onSuccess={
						payment => this.paypalOnSuccess(payment)
					}
					currency={this.paypalCurrency}
					total={this.state.total}
				/>

				{(isPlaidAuthenticating || this.state.isAppLoading) &&
        <div>
          <DemoWrapper>
            <Loader/>
          </DemoWrapper>
        </div>}
        {isPlaidAuthenticating &&
        <h1 className='not-connected'>
          Connecting to the bank...
        </h1>}
        {!cookies.get('accessToken') && !isPlaidAuthenticating &&
        <h1 className='not-connected'>
          Connection cancelled, please reconnect...
        </h1>}
        {cookies.get('accessToken') && !isPlaidAuthenticating &&
        <h1 className='not-connected'>
          Connected successfully.<br/>Your representative  should  be receiving your bank statements shortly.<br/>You may close this window.
        </h1>}
      </div>
		);
	}
}

const mapStateToProps = state => {
	return {
		auth: state.Auth,
		locale: state.LanguageSwitcher.language.locale,
		scrollHeight: state.App.scrollHeight, // toJs()
		fixedNavbar: state.App.fixedNavbar,
		view: state.App.view,
		isPlaidAuthenticating: state.Plaid.isAuthenticating,
    isAuthenticatingCancelled: state.Plaid.isAuthenticatingCancelled,
    plaidAccessToken: state.Plaid.plaidAccessToken,
    plaidPublicToken: state.Plaid.plaidPublicToken,
    plaidAssetReportToken: state.Plaid.plaidAssetReportToken,
    stateAssetReportToken: state.Plaid.stateAssetReportToken,
    accountList: state.Plaid.accountList,
		transactionList: state.Plaid.transactionList
	};
};
const appConect = connect(
	mapStateToProps,
	{
		logout,
		toggleAll,
		switchActivation,
    getPlaidAccessToken,
    getPlaidPublicToken,
		getPlaidAssetReportToken,
    getAccountInfo,
    getAccountInfo1,
    executePayment,
    setupPayment,
    getPaypalConfig
	}
)(App);
export default appConect;
