const PaypalActions = {
  GET_PAYPAL_CONFIG: 'GET_PAYPAL_CONFIG',
  SETUP_PAYMENT: 'SETUP_PAYMENT',
  EXECUTE_PAYMENT: 'EXECUTE_PAYMENT',

  getPaypalConfig: () => ({type: PaypalActions.GET_PAYPAL_CONFIG}),
  getPaypalConfigSuccess: () => ({type: PaypalActions.GET_PAYPAL_CONFIG}),
  getPaypalConfigFailed: () => ({type: PaypalActions.GET_PAYPAL_CONFIG}),
  setupPayment: () => ({type: PaypalActions.SETUP_PAYMENT}),
  setupPaymentSuccess: () => ({type: PaypalActions.SETUP_PAYMENT}),
  setupPaymentFailed: () => ({type: PaypalActions.SETUP_PAYMENT}),
  executePayment: data => ({type: PaypalActions.EXECUTE_PAYMENT, data}),
  executePaymentSuccess: data => ({type: PaypalActions.EXECUTE_PAYMENT, data}),
  executePaymentFailed: data => ({type: PaypalActions.EXECUTE_PAYMENT, data}),
};

export default PaypalActions;
