const userActions = {
  GET_USER: 'GET_USER',
  GET_USER_FAILED: 'GET_USER_FAILED',
  DELETE_USER: 'DELETE_USER',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  UPDATE_STATE: 'UPDATE_STATE',
  UPDATE_USER_SAGA: 'UPDATE_USER_SAGA',
  SELECT_CURRENT_USER: 'SELECT_CURRENT_USER',
  TOGGLE_VIEW: 'USER_TOGGLE_VIEW',
  UPDATE_EDIT_USER: 'USER_UPDATE_EDIT_INVOICE',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  initData: () => ({ type: userActions.GET_USER }),
  deleteUser: selected => {
    const selectedUsers = [];
    return (dispatch, getState) => {
      const users = getState().User.userList;
      let newUsers = [];
      users.forEach(user => {
        if (selected.length > 0) {
          let enableDelete = false;
          selected.forEach(id => {
            if(id === user.id) enableDelete = true;
          });
          if (!enableDelete) {
            newUsers.push(user);
            enableDelete = false;
          } else {
            selectedUsers.push({email: user.email, userType: user.userType});
          }
        } else {
          const selectedIndex = selected.id.indexOf(user.id);
          if (selectedIndex === -1) {
            newUsers.push(user);
          } else {
            selectedUsers.push({email: user.email, userType: user.userType});
          }
        }
      });
      dispatch({
        type: userActions.DELETE_USER,
        userList: newUsers,
        selectedUsers
      });
    };
  },

  updateUser: user => {
    return (dispatch, getState) => {
      const userList = getState().User.userList;
      const index = userList.map(user => user.id).indexOf(user.id);
      let curUser = {};
      let newUser = {};
      if (index === -1) {
        userList.push(user);
      } else {
        curUser = userList[index];
        newUser = user;
        userList[index] = user;
      }
      dispatch({
        type: userActions.UPDATE_USER_REQUEST,
        userList,
        newUser,
        curUser
      });
    };
  },
  getUserList: data => ({type: userActions.GET_USER, data}),
  selectCurrentUser: userId => ({ type: userActions.SELECT_CURRENT_USER, userId }),
  toggleView: view => ({ type: userActions.TOGGLE_VIEW, view }),
  editUser: user => ({ type: userActions.UPDATE_EDIT_USER, user })
};
export default userActions;
