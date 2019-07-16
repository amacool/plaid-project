import { all, takeEvery, put, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken, getToken } from '../../helpers/utility';
import actions from './actions';
import {postApi} from "../api";
import notification from "../../components/notification";

export function* loginRequest({payload}) {
  let res = yield call(postApi, {url: 'auth/login', data: payload});
  if (res && res.status) {
    localStorage.setItem('accessToken', res.token);
    yield put({
      type: actions.LOGIN_SUCCESS,
      payload: res.token
    });
  } else {
    if (res && !res.error) {
      notification('error', 'Invalid Username or Password!');
    }
    yield put({
      type: actions.LOGIN_ERROR
    });
  }
}
export function* logout() {
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_profile');
  localStorage.removeItem('admin_picture');
  localStorage.removeItem('selectedKey');
  localStorage.removeItem('accessToken');
  clearToken();
  let res = yield call(postApi, {url: 'auth/logout'});
  if(res) {
    yield put(push('/'));
  }
}
export function* checkAuthorization() {
  const token = getToken();
  if (token) {
    yield put({
      type: actions.LOGIN_SUCCESS,
      payload: { token },
      profile: 'Profile',
    });
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.CHECK_AUTHORIZATION, checkAuthorization),
    yield takeEvery(actions.LOGIN_REQUEST, loginRequest),
    yield takeEvery(actions.LOGOUT, logout),
  ]);
}
