import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import { IntlProvider } from 'react-intl';
import AppRouter from './appRouter';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import AppLocale from '../../languageProvider';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import plaidActions from '../../redux/plaid/actions';
import themeActions from '../../redux/themeSwitcher/actions';
import MUIPProvider from '../../components/uielements/materialUiPicker/momentProvider';
import { rtl } from '../../settings/withDirection';
import Main, { Root, AppFrame } from './style';
import './global.css';
import Loader from "../../components/utility/Loader";
import {DemoWrapper} from "../../components/utility/papersheet";
import Cookies from "universal-cookie";

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
		this.interval = 10000;
	}
	
	componentDidMount() {
    // let now = new Date();
    // now.setDate(now.getDate() + 30);
    // cookies.set('accessToken', 'access-production-530b4e9d-55ec-43bb-9091-1f4110555676', {path: '/', expires: now});
    
    const accessToken = cookies.get('accessToken');
    if (!accessToken) {
      console.log('getting token...');
    	this.props.getPlaidPublicToken();
    } else {
    	console.log('access token exists', accessToken);
      this.props.getAccountInfo(accessToken);
		}
	}
	
	componentWillReceiveProps(nextProps) {
    const accessToken = cookies.get('accessToken');
    if (nextProps.plaidPublicToken && this.props.plaidPublicToken !== nextProps.plaidPublicToken) {
    	// right after getting public token, get access token
      this.props.getPlaidAccessToken(nextProps.plaidPublicToken);
      
    } else if (!this.props.isAuthenticatingCancelled && nextProps.isAuthenticatingCancelled) {
      // user cancelled plaid authenticating
      this.setState({isAppLoading: false});
      clearTimeout(this.timer);
  
    } else if (this.props.plaidAccessToken !== nextProps.plaidAccessToken) {
    	// after getting access token, set 10 seconds timeout waiting for plaid retrieving data,
			// and then get account info
			console.log('set 10 seconds timeout, waiting for plaid to be prepared');
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
        this.props.getAccountInfo(accessToken);
			}, this.interval);
			
    } else if (!nextProps.transactionList && !nextProps.isLoading && this.state.isAppLoading) {
      // not prepared yet
      // console.log('set 10 seconds timeout, waiting for plaid to be prepared');
      // if (this.timer) {
      //   clearTimeout(this.timer);
      // }
      // this.timer = setTimeout(() => {
      // 	this.interval += 5;
      //   this.props.getAccountInfo(accessToken);
      // }, this.interval);
			
			// first loading was failed, run thread
      this.setState({isAppLoading: false});
      this.props.getAccountInfo1(accessToken);
      
    } else if ((this.props.accountList !== nextProps.accountList || this.props.transactionList !== nextProps.transactionList) && nextProps.transactionList) {
			// finally, app loading finishes here
			console.log('account info loading finished');
			this.setState({isAppLoading: false});
			this.props.location.pathname === '/dashboard' && this.props.history.push('/dashboard/accounts');
    }
	}
	
	render() {
		const anchor = rtl === 'rtl' ? 'right' : 'left';
		const {
			classes,
			theme,
			toggleAll,
			locale,
			match,
			scrollHeight,
			fixedNavbar,
			view,
      isPlaidAuthenticating
		} = this.props;
		const { url } = match;
		const options = { url, classes, theme, locale };
		const currentAppLocale = AppLocale[locale];
		return (
			<IntlProvider
				locale={currentAppLocale.locale}
				messages={currentAppLocale.messages}
			>
				<Root>
					<Debounce time="1000" handler="onResize">
						<WindowResizeListener
							onResize={windowSize =>
								toggleAll(windowSize.windowWidth, windowSize.windowHeight)
							}
						/>
					</Debounce>
					<AppFrame>
						<Topbar {...options} />
						{anchor === 'left' ? <Sidebar {...options} anchor={anchor} /> : ''}
						<Main
							className={
								view !== 'TabLandView' && view !== 'DesktopView'
									? ''
									: fixedNavbar
										? 'fixedNav'
										: 'notFixed'
							}
						>
							{(isPlaidAuthenticating || this.state.isAppLoading) &&
							<DemoWrapper>
								<Loader/>
							</DemoWrapper>}
							{isPlaidAuthenticating &&
              <h1 className='not-connected'>
                Connecting to the bank...
              </h1>}
							{!cookies.get('accessToken') && !isPlaidAuthenticating &&
							<h1 className='not-connected'>
								Not connected to the bank
							</h1>}
              {cookies.get('accessToken') && !this.props.transactionList &&
              <h1 className='not-connected'>
                Information not prepared yet
              </h1>}
              <MUIPProvider>
								<AppRouter
									style={{ height: scrollHeight, overflowY: 'auto', overflowX: 'unset' }}
									url={url}
								/>
							</MUIPProvider>
						</Main>

						{anchor === 'right' ? <Sidebar {...options} anchor={anchor} /> : ''}
					</AppFrame>
				</Root>
			</IntlProvider>
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
		isLoading: state.Plaid.isLoading,
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
