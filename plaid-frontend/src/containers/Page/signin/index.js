import React, {Component} from "react";
import {connect} from "react-redux";
import Button from "../../../components/uielements/button";
import authAction from "../../../redux/auth/actions";
import TextField from "../../../components/uielements/textfield";
import Scrollbars from "../../../components/utility/customScrollBar";
import SignInStyleWrapper from "./signin.style";
import {DemoWrapper} from "../../../components/utility/papersheet";
import Loader from "../../../components/utility/Loader";

const {login} = authAction;

class SignIn extends Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    const {history} = this.props;
    if (nextProps.isLoggedIn) {
      history.push('/dashboard');
    }
  }

  handleLogin = () => {
    const {login} = this.props;
    const {username, password} = this.state;
    if(username && password) {
      login({username, password});
    }
  };
  onChangeUsername = event => this.setState({username: event.target.value});
  onChangePassword = event => this.setState({password: event.target.value});

  render() {
    const {username, password} = this.state;
    const {isLoggedIn, isAuthenticating, history} = this.props;
    if (true) {
      history.push('/dashboard');
      return null;
    }
    return (
      <SignInStyleWrapper className="mateSignInPage">
        <div className="mateSignInPageContent">
          {
            isAuthenticating&&
            <DemoWrapper>
              <Loader />
            </DemoWrapper>
          }
          <Scrollbars style={{height: "100%"}}>
            <div className="mateSignInPageGreet">
              <h1>Welcome</h1>
              <p>
                Please Login with your information.
              </p>
            </div>
            <div className="mateSignInPageForm">
              <div className="mateInputWrapper">
                <TextField
                  label="Username"
                  placeholder="Username"
                  margin="normal"
                  defaultValue={username}
                  onChange={this.onChangeUsername}
                />
              </div>
            </div>
            <div className="mateSignInPageForm">
              <div className="mateInputWrapper">
                <TextField
                  label="Password"
                  placeholder="Password"
                  margin="normal"
                  type="Password"
                  defaultValue={password}
                  onChange={this.onChangePassword}
                />
              </div>
            </div>
            <div className="mateSignInPageForm">
              <div className="mateLoginSubmit">
                <Button type="primary" onClick={this.handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          </Scrollbars>
        </div>
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.isLoggedIn,
    isAuthenticating: state.Auth.isAuthenticating
  }),
  {login}
)(SignIn);
