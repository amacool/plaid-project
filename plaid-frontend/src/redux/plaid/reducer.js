import actions from './actions';

const initState = {
  accountList: [],
  transactionList: [],  // false: not prepared yet
  balanceList: [],      // false: not prepared yet
  plaidPublicToken: null,
  plaidAccessToken: null,
  plaidAssetReportToken: null,
  isLoading: false,
  isAuthenticatingCancelled: false,
  isAuthenticating: false,
  stateAssetReportToken: null,
  pageNum: null,
  itemsPerPage: null,
  totalPage: null
};

export default function plaidReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.GET_ACCOUNT_INFO:
      return {
        ...state,
        isLoading: true
      };
    case actions.GET_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountList: action.data.accounts.accounts || false,
        transactionList: action.data.transactions.transactions || false,
        isLoading: false
      };
    case actions.GET_ACCOUNT_INFO_FAILED:
      return {
        ...state,
        isLoading: false
      };

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
  
    case actions.GET_ASSET_REPORT_TOKEN:
      return {
        ...state,
        isAuthenticating: true
      };
    case actions.GET_ASSET_REPORT_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        plaidAssetReportToken: action.data,
        stateAssetReportToken: 1
      };
    case actions.GET_ASSET_REPORT_TOKEN_FAILED:
      return {
        ...state,
        isAuthenticating: false,
        stateAssetReportToken: 0
      };
      
    case actions.GET_PUBLIC_TOKEN:
      return {
        ...state,
        isAuthenticating: true,
        isAuthenticatingCancelled: false
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
        isAuthenticating: false,
        isAuthenticatingCancelled: true
      };
      
    default:
      return state;
  }
}
