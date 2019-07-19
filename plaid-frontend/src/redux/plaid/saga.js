import Cookies from 'universal-cookie';
import notification from "../../components/notification";
import actions from './actions';
import {all, takeEvery, put, call} from 'redux-saga/effects';
import {postApi} from "../api";
import {plaidPublicKey} from "../constants";
const cookies = new Cookies();

export function* getAccountList(data) {
  let res = yield call(postApi, {url: 'plaid/getAccounts', data: data});
  if (res && res.status) {
    yield put(actions.getAccountListSuccess(res.data.accounts));
  } else {
    console.log(res);
    yield put(actions.getAccountListFailed());
  }
}

export function* getTransactionList(data) {
  let res = yield call(postApi, {url: 'plaid/getTransactions', data: data});
  if (res && res.status) {
    yield put(actions.getTransactionListSuccess(res.data.transactions));
  } else {
    yield put(actions.getTransactionListFailed());
  }
}

export function* getBalanceList(data) {
  let res = yield call(postApi, {url: 'plaid/getBalances', data: data});
  if (res && res.status) {
    yield put(actions.getBalanceListSuccess(res.data));
  } else {
    yield put(actions.getBalanceListFailed());
  }
}

export function* getAccessToken(data) {
  let res = yield call(postApi, {url: 'plaid/getPlaidAccessToken', data: data});
  if (res && res.status) {
    let now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    cookies.set('accessToken', res.data.access_token, {path: '/', expires: now});
    yield put(actions.getPlaidAccessTokenSuccess(res.data.access_token));
  } else {
    yield put(actions.getPlaidAccessTokenFailed());
  }
}

export function* getPublicToken() {
  if (!window.Plaid)
    return;
  let publicToken = yield new Promise((resolve) => {
    window.plaidHandler = window.Plaid.create({
      apiVersion: 'v2',
      clientName: 'Plaid Quickstart',
      env: 'production',
      product: ["transactions"],
      key: plaidPublicKey,
      countryCodes: ['US', 'CA'],
      onSuccess: (public_token) => {
        resolve(public_token);
      },
      onLoad: () => {
        window.plaidHandler.open();
      },
      onExit: function(err, metadata) {
        if (err != null) {
          notification('error', err.error_message);
        } else {
          notification('error', 'Not connected to the bank');
        }
        resolve(false);
      },
    });
  });
  if (publicToken) {
    yield put(actions.getPlaidPublicTokenSuccess(publicToken));
  } else {
    yield put(actions.getPlaidPublicTokenFailed());
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_PUBLIC_TOKEN, getPublicToken),
    yield takeEvery(actions.GET_ACCESS_TOKEN, getAccessToken),
    yield takeEvery(actions.GET_ACCOUNT_LIST, getAccountList),
    yield takeEvery(actions.GET_BALANCE_LIST, getBalanceList),
    yield takeEvery(actions.GET_TRANSACTION_LIST, getTransactionList)
  ]);
}
