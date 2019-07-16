import React, {Component} from 'react';
import asyncComponent from '../../helpers/AsyncFunc';
import Route from '../../components/utility/customRoute';

const routes = [
  {
    path: 'accounts',
    exact: true,
    component: asyncComponent(() => import('../../customApp/containers/Accounts/index.js')),
  },
  {
    path: 'accounts/:accountId',
    exact: true,
    component: asyncComponent(() => import('../../customApp/containers/Accounts/accountDetail.js')),
  },
  {
    path: 'transactions',
    exact: true,
    component: asyncComponent(() => import('../../customApp/containers/Transactions/index.js')),
  }
];

class AppRouter extends Component {
  render() {
    const {url, style} = this.props;
    return (
      <div style={style}>
        {routes.map(singleRoute => {
          const {path, exact, ...otherProps} = singleRoute;
          return (
            <Route
              exact={exact !== false}
              key={path}
              path={`${url}/${path}`}
              {...otherProps}
            />
          );
        })}
      </div>
    );
  }
}

export default AppRouter;
