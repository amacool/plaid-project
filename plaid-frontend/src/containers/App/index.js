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
const { getPlaidAccessToken, getPlaidPublicToken } = plaidActions;

class App extends Component {
	componentDidMount() {
    // let now = new Date();
    // now.setDate(now.getDate() + 30);
    // cookies.set('accessToken', 'access-production-1fe99ee8-e21c-42a0-8c83-7d3660d62283', {path: '/', expires: now});
    
    const accessToken = cookies.get('accessToken');
    !accessToken && this.props.getPlaidPublicToken();
    accessToken && this.props.location.pathname === '/dashboard' && this.props.history.push('/dashboard/accounts');
	}
	
	componentWillReceiveProps(nextProps) {
    if (nextProps.plaidPublicToken && this.props.plaidPublicToken !== nextProps.plaidPublicToken) {
    	console.log('getting access token');
      this.props.getPlaidAccessToken(nextProps.plaidPublicToken);
    } else if (this.props.plaidAccessToken !== nextProps.plaidAccessToken) {
      this.props.history.push('/dashboard/accounts');
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
							{isPlaidAuthenticating &&
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
		isPlaidAuthenticating: state.Plaid.isAuthenticating,
    plaidAccessToken: state.Plaid.plaidAccessToken,
    plaidPublicToken: state.Plaid.plaidPublicToken,
	};
};
const appConect = connect(
	mapStateToProps,
	{
		logout,
		toggleAll,
		switchActivation,
    getPlaidAccessToken,
    getPlaidPublicToken
	}
)(App);
export default appConect;
