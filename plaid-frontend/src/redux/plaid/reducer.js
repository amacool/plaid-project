import actions from './actions';

const initState = {
  accountList: [],
  transactionList: [],
  balanceList: [],
  plaidPublicToken: null,
  plaidAccessToken: null,
  isLoading: false,
  isAuthenticating: true,
  pageNum: null,
  itemsPerPage: null,
  totalPage: null
};

export default function plaidReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.GET_ACCOUNT_LIST:
      return {
        ...state,
        isLoading: true
      };
    case actions.GET_ACCOUNT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        accountList: action.data
      };
    case actions.GET_ACCOUNT_LIST_FAILED:
      return {
        ...state,
        isLoading: false
      };
  
    case actions.GET_TRANSACTION_LIST:
      return {
        ...state,
        isLoading: true
      };
    case actions.GET_TRANSACTION_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactionList: action.data
      };
    case actions.GET_TRANSACTION_LIST_FAILED:
      return {
        ...state,
        isLoading: false
      };
  
    case actions.GET_BALANCE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case actions.GET_BALANCE_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        balanceList: action.data
      };
    case actions.GET_BALANCE_LIST_FAILED:
      return {
        ...state,
        isLoading: false
      };
  
    case actions.GET_ACCESS_TOKEN:
      return {
        ...state,
        isAuthenticating: true
      };
    case actions.GET_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        plaidAccessToken: action.data
      };
    case actions.GET_ACCESS_TOKEN_FAILED:
      return {
        ...state,
        isAuthenticating: false
      };
      
    case actions.GET_PUBLIC_TOKEN:
      return {
        ...state,
        isAuthenticating: true
      };
    case actions.GET_PUBLIC_TOKEN_SUCCESS:
      return {
        ...state,
        plaidPublicToken: action.data,
        isAuthenticating: false
      };
    case actions.GET_PUBLIC_TOKEN_FAILED:
      return {
        ...state,
        isAuthenticating: false
      };
      
    default:
      return state;
  }
}
