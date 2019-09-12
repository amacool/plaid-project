import React, { Component } from 'react';
import { connect } from 'react-redux';
import appActions from '../../redux/app/actions';
import { AppHolder, Toolbar, TopbarComponents } from './style';
import TopbarUser from './topbarUser';
const { toggleCollapsed } = appActions;

class Topbar extends Component {
	render() {
		const { locale, url, customizedTheme } = this.props;
		const propsTopbar = { locale, url };
		return (
			<AppHolder style={{ background: '#0250CB' }}>
				<Toolbar
					style={{
						paddingLeft: '30px',
						minHeight: '64px',
						background: customizedTheme.topbarTheme,
					}}
				>
					<TopbarComponents>
						<ul className="topbarItems">
							<li className="topbarUser">
								<TopbarUser {...propsTopbar} />
							</li>
						</ul>
					</TopbarComponents>
				</Toolbar>
			</AppHolder>
		);
	}
}

export default connect(
	state => ({
		...state.App,
		locale: state.LanguageSwitcher.language.locale,
		customizedTheme: state.ThemeSwitcher.topbarTheme
	}),
	{ toggleCollapsed }
)(Topbar);
