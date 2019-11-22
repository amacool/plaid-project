import notification from "../../components/notification";
import actions from './actions';
import {all, takeEvery, put, call} from 'redux-saga/effects';
import {postApi} from "../api";

export function* getPaypalConfig(data) {
  let res = yield call(postApi, {url: 'paypal/getConfig', data: data});
  if (res && res.status) {
    yield put(actions.getPaypalConfigSuccess(res.data));
  } else {
    yield put(actions.getPaypalConfigFailed());
  }
}

export function* setupPayment(data) {
  let res = yield call(postApi, {url: 'paypal/setupPayment', data: data});
  if (res && res.status) {
    if (!res.data.transactions.transactions) {
      notification('error', 'Information not prepared yet, please wait...');
    }
    yield put(actions.setupPaymentSuccess(res.data));
  } else {
    yield put(actions.setupPaymentFailed());
  }
}

export function* executePayment(data) {
  let res = yield call(postApi, {url: 'paypal/executePayment', data: data});
  if (res && res.status) {
    yield put(actions.executePaymentSuccess(res.data.accounts));
  } else {
    yield put(actions.executePaymentFailed());
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_PAYPAL_CONFIG, getPaypalConfig),
    yield takeEvery(actions.SETUP_PAYMENT, setupPayment),
    yield takeEvery(actions.EXECUTE_PAYMENT, executePayment),
  ]);
}
