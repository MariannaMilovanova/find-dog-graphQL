import * as types from '../actions/types';

function user(state = null, action) {
  switch (action.type) {
    case types.LOGIN_GET_USER_DATA:
      return action.data;
    case types.LOG_OUT:
      return null;

    default:
      return state;
  }
}

export default user;
