import clone from 'clone';
import actions from './actions';

const initState = {
  user: null,
  userList: [],
  isUpdating: false,
  isLoading: false,
  initialUserList: true,
  currentUser: {},
  enableEditView: false,
  userId: null,
  selected: null,
  pageNum: null,
  itemsPerPage: null,
  totalPage: null
};

export default function userReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.GET_USER:
      return {
        ...state,
        isLoading: true,
        isUpdating: false
      };
    case actions.DELETE_USER:
      const currentUser = action.user
        ? action.user
        : state.currentUser;
      return {
        ...state,
        isLoading: false,
        isUpdating: true,
        userList: action.userList,
        currentUser: clone(currentUser),
        initialUserList: true,
        isNewUser: false,
        enableEditView: false,
        usersState: action.usersState,
        selected: action.selected
      };
    case actions.DELETE_USER_SUCCESS:
      return {
        ...state,
        isUpdating: false
      };
    case actions.GET_USER_FAILED:
      return {
        ...state,
        isLoading: false,
        isUpdating: false
      };
    case actions.UPDATE_STATE: {
      const currentUser = action.user
        ? action.user
        : state.currentUser;
      return {
        ...state,
        isLoading:false,
        userList: action.userList,
        currentUser: clone(currentUser),
        initialUserList: true,
        isNewUser: false,
        enableEditView: false,
        usersState: action.usersState,
        pageNum: action.pageNum,
        totalPage: action.totalPage,
        itemsPerPage: action.itemsPerPage
      };
    }
    case actions.UPDATE_USER_REQUEST: {
      const currentUser = action.newUser
        ? action.newUser
        : state.currentUser;
      return {
        ...state,
        isUpdating: true,
        userList: action.userList,
        currentUser: clone(currentUser),
        initialUserList: true,
        isNewUser: false,
        enableEditView: false,
        usersState: action.usersState
      };
    }
    case actions.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        isUpdating: false
      }
    }
    case actions.SELECT_CURRENT_USER: {
      const userList = state.userList;
      const index = userList.map(user => user.id).indexOf(action.userId);
      const isNewUser = index === -1;
      const currentUser = userList[index];
      let enableEditView = false;
      enableEditView = isNewUser;
      return {
        ...state,
        isUpdating: true,
        currentUser: currentUser,
        editableUser: clone(currentUser),
        isNewUser: isNewUser,
        enableEditView: enableEditView
      };
    }
    case actions.TOGGLE_VIEW:
      return {
        ...state,
        enableEditView: action.view,
        editableUser: clone(state.currentUser)
      };
    case actions.UPDATE_EDIT_USER:
      return { ...state, editableUser: clone(action.user) };
    default:
      return state;
  }
}
