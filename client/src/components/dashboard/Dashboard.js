

import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaidLinkButton from "react-plaid-link-button";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getAccounts, addAccount, createLinkToken } from "../../actions/accountActions";
import Accounts from "./Accounts";
import Spinner from "./Spinner";

class Dashboard extends Component {
  state = {
    linkToken: null, // Store link_token for Plaid Link
  };

  async componentDidMount() {
    this.props.getAccounts();
    const linkToken = await this.props.createLinkToken(); // Get the link_token
    this.setState({ linkToken });
  }

  // Logout
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  // Add account
  handleOnSuccess = (public_token, metadata) => {
    const plaidData = {
      public_token,
      metadata,
    };
    this.props.addAccount(plaidData);
  };

  render() {
    const { user } = this.props.auth;
    const { accounts, accountsLoading } = this.props.plaid;
    const { linkToken } = this.state;

    let dashboardContent;

    if (accounts === null || accountsLoading) {
      dashboardContent = <Spinner />;
    } else if (accounts.length > 0) {
      // User has accounts linked
      dashboardContent = <Accounts user={user} accounts={accounts} />;
    } else {
      // User has no accounts linked
      dashboardContent = (
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Welcome,</b> {user.name.split(" ")[0]}
            </h4>
            <p className="flow-text grey-text text-darken-1">
              To get started, link your first bank account below
            </p>
            <div>
              {linkToken ? (
                <PlaidLinkButton
                  token={linkToken}
                  onSuccess={this.handleOnSuccess}
                  onExit={(error, metadata) => {
                    console.log("Plaid Link exit:", error, metadata);
                  }}
                >
                  Link Account
                </PlaidLinkButton>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <button
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    return <div className="container">{dashboardContent}</div>;
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getAccounts: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  createLinkToken: PropTypes.func.isRequired, // Add this prop
  auth: PropTypes.object.isRequired,
  plaid: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  plaid: state.plaid,
});

export default connect(mapStateToProps, {
  logoutUser,
  getAccounts,
  addAccount,
  createLinkToken,
})(Dashboard);
