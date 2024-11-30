import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers"; // Replace with your actual root reducer import

const store = configureStore({
  reducer: rootReducer, // Root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add thunk if not included in defaults
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in non-production environments
});

export default store;
