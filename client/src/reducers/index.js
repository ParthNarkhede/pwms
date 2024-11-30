// import { combineReducers } from "redux";
// import authReducer from "./authReducer";
// import errorReducer from "./errorReducer";
// import accountReducer from "./accountReducer";

// export default combineReducers({
//   auth: authReducer,
//   errors: errorReducer,
//   plaid: accountReducer
// });



import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import accountReducer from "./accountReducer"; // Replace with your reducers

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  plaid: accountReducer // Replace with your reducers
});

export default rootReducer;
