import actions from './actions';
import {all, takeEvery, put, call} from 'redux-saga/effects';
import {postApi} from "../api";
import {plaidPublicKey} from "../constants";

export function* getAccountList(data) {
  let res = yield call(postApi, {url: 'plaid/getAccountList', data: data});
  if (res && res.status) {
    yield put(actions.getAccountListSuccess(res.data.accounts));
  } else {
    yield put(actions.getAccountListFailed());
  }
}

export function* getTransactionList(data) {
  let res = yield call(postApi, {url: 'plaid/getTransactionList', data: data});
  if (res && res.status) {
    yield put(actions.getTransactionListSuccess(res.data.transactions));
  } else {
    yield put(actions.getTransactionListFailed());
  }
}

export function* getBalanceList(data) {
  let res = yield call(postApi, {url: 'plaid/getBalanceList', data: data});
  if (res && res.status) {
    yield put(actions.getBalanceListSuccess(res.data));
  } else {
    yield put(actions.getBalanceListFailed());
  }
}

export function* getAccessToken(data) {
  let res = yield call(postApi, {url: 'plaid/getPlaidAccessToken', data: data});
  if (res && res.status) {
    yield put(actions.getPlaidAccessTokenSuccess(res.data));
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
        if (!localStorage.getItem('accessToken')) {
          return;
        }
        window.plaidHandler.open();
      }
    });
  });
  yield put(actions.getPlaidPublicTokenSuccess(publicToken));
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
