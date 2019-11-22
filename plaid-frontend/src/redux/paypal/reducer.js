import actions from './actions';

const initState = {
  paypalConfig: null,
  status: false,
  payment: null,
  paymentResult: null,
};

export default function paypalReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.GET_PAYPAL_CONFIG:
      return {
        ...state,
        paypalConfig: action.data.paypalConfig
      };
    case actions.SETUP_PAYMENT:
      return {
        ...state,
        payment: action.data.payment
      };
    case actions.EXECUTE_PAYMENT:
      return {
        ...state,
        paymentResult: action.data.paymentResult
      };

    default:
      return state;
  }
}
