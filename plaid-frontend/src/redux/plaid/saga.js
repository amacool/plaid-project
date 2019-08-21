import Cookies from 'universal-cookie';
import notification from "../../components/notification";
import actions from './actions';
import {all, takeEvery, put, call} from 'redux-saga/effects';
import {postApi} from "../api";
import {plaidPublicKey} from "../constants";
const cookies = new Cookies();

export function* getPublicToken() {
  if (!window.Plaid)
    return;
  let publicToken = yield new Promise((resolve) => {
    window.plaidHandler = window.Plaid.create({
      apiVersion: 'v2',
      clientName: 'Plaid Quickstart',
      env: 'production',
      product: ["transactions", "auth", "assets"], // assets
      key: plaidPublicKey,
      countryCodes: ['US', 'CA'],
      onSuccess: (public_token) => {
        resolve(public_token);
      },
      onLoad: () => {
        window.plaidHandler.open();
      },
      onExit: function(err, metadata) {
        console.log(err);
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
    console.log(publicToken);
    yield put(actions.getPlaidPublicTokenSuccess(publicToken));
  } else {
    yield put(actions.getPlaidPublicTokenFailed());
  }
}

export function* getAccessToken(data) {
  console.log('getAccessToken pre: ', data);
  let res = yield call(postApi, {url: 'plaid/getPlaidAccessToken', data: data});
  console.log('getAccessToken', res);
  if (res && res.status) {
    let now = new Date();
    now.setDate(now.getDate() + 180);
    cookies.set('accessToken', res.data.access_token, {path: '/', expires: now});
    yield put(actions.getPlaidAccessTokenSuccess(res.data));
  } else {
    yield put(actions.getPlaidAccessTokenFailed());
  }
}

export function* getAssetReportToken(data) {
  console.log('getAssetReportToken pre: ', data);
  let res = yield call(postApi, {url: 'plaid/getPlaidAssetReportToken', data: {data: data.data.accessToken}});
  console.log('getAssetReportToken: ', res);
  if (res && res.status) {
    let now = new Date();
    now.setDate(now.getDate() + 180);
    cookies.set('assetReportToken', res.data.assetReportToken, {path: '/', expires: now});
    yield put(actions.getPlaidAssetReportTokenSuccess(res.data));
  } else if (res.updateItem) {
    // if the user changed credentials, updating item is required
    console.log('update item...');
    let updateResult = yield new Promise((resolve) => {
      window.plaidHandler = window.Plaid.create({
        env: 'production',
        clientName: 'Plaid Quickstart',
        product: ["transactions", "auth", "assets"], // assets
        key: plaidPublicKey,
        countryCodes: ['US', 'CA'],
        token: data.publicToken,
        onSuccess: function (public_token, metadata) {
          resolve(public_token);
        },
        onExit: function (err, metadata) {
          // The user exited the Link flow.
          if (err != null) {
            console.log(err);
          }
          resolve(false);
        },
        onLoad: () => {
          window.plaidHandler.open();
        }
      });
    });
    console.log('after update item...');
    console.log(updateResult);
    
    if (updateResult) {
      yield put(actions.getPlaidPublicTokenSuccess(updateResult));
      console.log('update item success');
    } else {
      console.log('update item failed');
    }
    yield put(actions.getPlaidAssetReportTokenFailed());
  } else {
    yield put(actions.getPlaidAssetReportTokenFailed());
  }
}

export function* getAccountInfo(data) {
  let res = yield call(postApi, {url: 'plaid/getAccountInfo', data: data});
  console.log(res.data);
  if (res && res.status) {
    if (!res.data.transactions.transactions) {
      notification('error', 'Information not prepared yet, please wait...');
    }
    yield put(actions.getAccountInfoSuccess(res.data));
  } else {
    console.log(res);
    yield put(actions.getAccountInfoFailed());
  }
}

export function* getAccountInfo1(data) {
  // refresh asset report token
  let refreshData = null;
  if (cookies.get('assetReportToken')) {
    refreshData = yield call(
      postApi,
      {
        url: 'plaid/refreshAssetToken',
        data: {
          assetReportToken: cookies.get('assetReportToken')
        }
      }
    );
  }
  if (refreshData && refreshData.status && refreshData.data.assetReportToken) {
    console.log('success');
    let now = new Date();
    now.setDate(now.getDate() + 180);
    cookies.set('assetReportToken', refreshData.data.assetReportToken, {path: '/', expires: now});
    data.assetReportToken = refreshData.data.assetReportToken;
  }
  
  // get account info
  let res = yield call(postApi, {url: 'plaid/getAccountInfo1', data: data});
  console.log(res);
}

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

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_PUBLIC_TOKEN, getPublicToken),
    yield takeEvery(actions.GET_ACCESS_TOKEN, getAccessToken),
    yield takeEvery(actions.GET_ASSET_REPORT_TOKEN, getAssetReportToken),
    yield takeEvery(actions.GET_ACCOUNT_INFO, getAccountInfo),
    yield takeEvery(actions.GET_ACCOUNT_INFO1, getAccountInfo1),
    yield takeEvery(actions.GET_ACCOUNT_LIST, getAccountList),
    yield takeEvery(actions.GET_TRANSACTION_LIST, getTransactionList)
  ]);
}
