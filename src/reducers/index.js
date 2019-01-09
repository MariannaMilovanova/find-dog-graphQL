import { combineReducers } from 'redux';
import user from './user';
import markers from './markers';
import radius from './radius';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  user,
  markers,
  radius,
  form: formReducer
});

export default rootReducer;
