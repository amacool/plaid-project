import React from "react";
import {Route} from "react-router-dom";
import {connect} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import App from "./containers/App";
import asyncComponent from "./helpers/AsyncFunc";
import Auth0 from "./helpers/auth0";

const PublicRoutes = ({history, isLoggedIn}) => (
  <BrowserRouter>
    <div>
      <Route
        path="/auth0loginCallback"
        render={props => {
          Auth0.handleAuthentication(props);
        }}
      />
      <Route
        exact
        path="/404"
        component={asyncComponent(() => import("./containers/Page/404"))}
      />
      <Route
        exact
        path="/505"
        component={asyncComponent(() => import("./containers/Page/505"))}
      />
      <Route
        exact
        path="/forgot-password"
        component={asyncComponent(() =>
          import("./containers/Page/forgetpassword")
        )}
      />
      <Route
        exact
        path="/reset-password"
        component={asyncComponent(() =>
          import("./containers/Page/resetpassword")
        )}
      />
      <Route
        exact
        path="/"
        component={({history}) => {history.push('/load');return null;}}
      />
      <Route
        path="/load"
        component={App}
      />
      {/*<Route*/}
        {/*exact*/}
        {/*path="/"*/}
        {/*component={({history}) => {history.push('/dashboard');return null;}}*/}
      {/*/>*/}
      {/*<Route*/}
        {/*path="/dashboard"*/}
        {/*component={App}*/}
      {/*/>*/}
    </div>
  </BrowserRouter>
);

function mapStateToProps(state) {
  return {
    isLoggedIn: state.Auth.isLoggedIn
  };
}

export default connect(mapStateToProps)(PublicRoutes);
