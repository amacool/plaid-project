import actions from './actions';
import {localDataName} from "../../customApp/containers/user/config";
import { all, takeEvery, put, call } from 'redux-saga/effects';
import {postApi} from "../api";

class userData {
  id = '';
  email = '';
  given_name = '';
  middle_name = '';
  record_created = '';
  picture = '';
  userType = '';
  phone = '';
  password = '';
}

let usersData: userData[] = [];

export function* getUserList({data}) {
  let body = {pageNum: data.pageNum, itemsPerPage: data.itemsPerPage};
  if(data.dashboard) body = {dashboard: true};
  let res = yield call(postApi, {url: '/getUserList', data: body});
  if (res && res.status) {
    if(!data.dashboard) {
      usersData = [];
      res.data.users.forEach(data => {
        let user = new userData();
        user.id = data.userid;
        user.email = data.email;
        user.given_name = data.cognitoPool.userAttributes.given_name;
        user.middle_name = data.cognitoPool.userAttributes.middle_name;
        user.picture = data.cognitoPool.userAttributes.picture;
        user.phone = data.cognitoPool.userAttributes.phone_number;
        user.record_created = data.record_created;
        user.userType = data.userType;
        usersData.push(user);
      });
    }
    if(!data.dashboard) {
      const usersState = res.data.usersState;
      yield put({
        type: actions.UPDATE_STATE,
        userList: usersData,
        usersState: usersState,
        pageNum: res.pageInfo.pageNum,
        itemsPerPage: res.pageInfo.itemsPerPage,
        totalPage: res.data.totalPage,
      });
    } else {
      const usersState = res.data;
      yield put({
        type: actions.UPDATE_STATE,
        usersState: usersState,
      });
    }
  } else {
    yield put({ type: actions.GET_USER_FAILED});
  }
}

export function* updateUserSaga({ userList, user }) {
  localStorage.setItem(localDataName, JSON.stringify(userList));
  yield put({
    type: actions.UPDATE_STATE,
    userList,
    user
  });
}

export function* deleteUser(data) {
  let body = data.selectedUsers;
  let res = yield call(postApi, {url: '/deleteUser', data: body});
  if (res && res.status) {
    yield put({
      type: actions.DELETE_USER_SUCCESS,
    });
  }
}

export function* updateUser(data) {
  let body = {newUser: data.newUser, curUser: data.curUser};
  let res = yield call(postApi, {url: '/updateUser', data: body});
  if (res && res.status) {
    yield put({
      type: actions.UPDATE_STATE,
    });
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_USER, getUserList),
    yield takeEvery(actions.UPDATE_USER_SAGA, updateUserSaga),
    yield takeEvery(actions.DELETE_USER, deleteUser),
    yield takeEvery(actions.UPDATE_USER_REQUEST, updateUser),
  ]);
}
