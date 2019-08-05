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

const cookies = new Cookies();
const { logout } = authAction;
const { toggleAll } = appActions;
const { switchActivation } = themeActions;
const { getPlaidAccessToken, getPlaidPublicToken, getPlaidAssetReportToken, getAccountInfo, getAccountInfo1 } = plaidActions;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAppLoading: true
		};
		this.timer = null;
		this.interval = 5000;
	}
	
	componentDidMount() {
    // this.props.getPlaidAccessToken('public-production-b64226f9-5203-4e9d-881a-8e18014accbc');
    // this.props.getPlaidAssetReportToken({
    //   accessToken: 'access-production-52931c57-34d9-4bf6-a4b9-1843149af43d',
    // 	publicToken: 'public-production-b64226f9-5203-4e9d-881a-8e18014accbc',
    // });
    // return;
    
    // let now = new Date();
    // now.setDate(now.getDate() + 180);
    // cookies.set('accessToken', 'access-production-84f9d723-46b9-4696-9502-3745618ba70c', {path: '/', expires: now});
    // cookies.set('assetReportToken', 'assets-production-839a606d-82db-4116-bd3b-7cd808dfba19', {path: '/', expires: now});

    const accessToken = cookies.get('accessToken');
    const assetReportToken = cookies.get('assetReportToken');
    if (!accessToken || !assetReportToken) {
      console.log('getting token...');
    	this.props.getPlaidPublicToken();
    } else {
      this.props.getAccountInfo1({accessToken, assetReportToken});
      notification('info', 'Connected Successfully!');
      this.setState({isAppLoading: false});
		}
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
      notification('info', 'Connected Successfully!');
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
	
	render() {
		const {isPlaidAuthenticating} = this.props;
		return (
		  <div style={{textAlign: 'center', paddingTop: '80px'}}>
        <Topbar />
				
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
          Connected Successfully!
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
    getAccountInfo1
	}
)(App);
export default appConect;
