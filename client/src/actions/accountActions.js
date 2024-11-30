import axios from "axios";

import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_TRANSACTIONS,
  TRANSACTIONS_LOADING,
  CREATE_LINK_TOKEN,
} from "./types";

// Add account
export const addAccount = (plaidData, accessToken) => (dispatch) => {
  const accounts = plaidData.accounts;

  // Set the Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  axios
    .post("http://localhost:5000/api/plaid/accounts/add", plaidData)  // Update URL to correct backend API
    .then((res) => {
      dispatch({
        type: ADD_ACCOUNT,
        payload: res.data,
      });
      // Ensure accounts are concatenated correctly
      if (accounts) {
        dispatch(getTransactions(accounts.concat(res.data.payload), accessToken));
      }
    })
    .catch((err) => {
      console.error("Error adding account:", err);
    });
};

// Delete account
export const deleteAccount = (plaidData, accessToken) => (dispatch) => {
  if (window.confirm("Are you sure you want to remove this account?")) {
    const id = plaidData.id;
    const newAccounts = plaidData.accounts.filter(
      (account) => account._id !== id
    );

    // Set the Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    axios
      .delete(`http://localhost:5000/api/plaid/accounts/${id}`)  // Update URL to correct backend API
      .then(() => {
        dispatch({
          type: DELETE_ACCOUNT,
          payload: id,
        });
        if (newAccounts) {
          dispatch(getTransactions(newAccounts, accessToken));
        }
      })
      .catch((err) => {
        console.error("Error deleting account:", err);
      });
  }
};

// Get all accounts for specific user
export const getAccounts = (accessToken) => (dispatch) => {
  dispatch(setAccountsLoading());

  // Set the Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  axios
    .get("http://localhost:5000/api/plaid/accounts")  // Update URL to correct backend API
    .then((res) =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: null,
      })
    );
};

// Accounts loading
export const setAccountsLoading = () => {
  return {
    type: ACCOUNTS_LOADING,
  };
};

// Get Transactions
export const getTransactions = (plaidData, accessToken) => (dispatch) => {
  dispatch(setTransactionsLoading());

  // Set the Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  axios
    .post("http://localhost:5000/api/plaid/accounts/transactions", plaidData)  // Update URL to correct backend API
    .then((res) =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: null,
      })
    );
};

// Transactions loading
export const setTransactionsLoading = () => {
  return {
    type: TRANSACTIONS_LOADING,
  };
};

// Create Link Token (new action added)
export const createLinkToken = (userId, accessToken) => (dispatch) => {
  // Ensure accessToken is passed to the API
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  axios
    .post("http://localhost:5000/api/plaid/create-link-token", { userId })
    .then((res) => {
      dispatch({
        type: CREATE_LINK_TOKEN,
        payload: res.data.link_token, // Assuming the backend returns link_token
      });
    })
    .catch((err) => {
      console.error("Error creating link token:", err);
    });
};
