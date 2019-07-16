import actions from "./actions";

const initState = {
  idToken: null,
  isLoggedIn: false,
  isAuthenticating: false
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoggedIn: false,
        isAuthenticating: true
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isAuthenticating: false,
        user: action.payload
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isAuthenticating: false
      };
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
