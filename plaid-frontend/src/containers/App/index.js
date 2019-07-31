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
const { getPlaidAccessToken, getPlaidPublicToken, getAccountInfo, getAccountInfo1 } = plaidActions;

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
    // let now = new Date();
    // now.setDate(now.getDate() + 180);
    // cookies.set('accessToken', 'access-production-2fb94219-f660-48b5-bd6e-ec0c326a72cd', {path: '/', expires: now});
    // cookies.set('assetReportToken', 'assets-production-839a606d-82db-4116-bd3b-7cd808dfba19', {path: '/', expires: now});
    
    const accessToken = cookies.get('accessToken');
    const assetReportToken = cookies.get('assetReportToken');
    if (!accessToken) {
      console.log('getting token...');
    	this.props.getPlaidPublicToken();
    } else {
    	console.log('access token exists', accessToken);
      this.props.getAccountInfo1({accessToken, assetReportToken});
      notification('info', 'Connected Successfully!');
      this.setState({isAppLoading: false});
		}
	}
	
	componentWillReceiveProps(nextProps) {
    const accessToken = cookies.get('accessToken');
    const assetReportToken = cookies.get('assetReportToken');
    if (nextProps.plaidPublicToken && this.props.plaidPublicToken !== nextProps.plaidPublicToken) {
    	// right after getting public token, get access token
      this.props.getPlaidAccessToken(nextProps.plaidPublicToken);
      
    } else if (!this.props.isAuthenticatingCancelled && nextProps.isAuthenticatingCancelled) {
      // user cancelled plaid authenticating
      clearTimeout(this.timer);
      this.props.getPlaidPublicToken();
  
    } else if (this.props.plaidAccessToken !== nextProps.plaidAccessToken) {
    	// after getting access token, set 10 seconds timeout waiting for plaid retrieving data,
			// and then get account info
			this.props.getAccountInfo1({accessToken, assetReportToken});
			notification('info', 'Connected Successfully!');
			this.setState({isAppLoading: false});
			
    } else if (!nextProps.transactionList && !nextProps.isLoading && this.state.isAppLoading) {
      // not prepared yet
      console.log('set 10 seconds timeout, waiting for plaid to be prepared');
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
      	this.interval += 5000;
        this.props.getAccountInfo(accessToken);
      }, this.interval);
      
    } else if ((this.props.accountList !== nextProps.accountList || this.props.transactionList !== nextProps.transactionList) && nextProps.transactionList) {
			// finally, app loading finishes here
			console.log('account info loading finished');
			this.setState({isAppLoading: false});
			notification('info', 'Connected Successfully!');
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
    getAccountInfo,
    getAccountInfo1
	}
)(App);
export default appConect;
