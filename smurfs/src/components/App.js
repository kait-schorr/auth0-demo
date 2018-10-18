import React, { Component } from "react";
import "./App.css";
import SmurfList from "./SmurfList";
import SmurfForm from "./SmurfForm";
import { connect } from "react-redux";
import { getSmurfs } from "../actions";
import { Container } from "reactstrap";
import { Auth0Lock } from "auth0-lock";
import auth0 from "auth0-js";

/*
 to wire this component up you're going to need a few things.
 I'll let you do this part on your own. 
 Just remember, `how do I connect my components to redux?`
 `How do I ensure that my component links the state to props?`
 */
var webAuth = new auth0.WebAuth({
  domain: process.env.REACT_APP_DOMAIN,
  clientID: process.env.REACT_APP_CLIENT_ID,
  redirectUri: "http://localhost:3000/callback"
});

var lock = new Auth0Lock(
  process.env.REACT_APP_CLIENT_ID,
  process.env.REACT_APP_DOMAIN
);
webAuth.parseHash((err, authResult) => {
  if (authResult) {
    // Save the tokens from the authResult in local storage or a cookie
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("expires_at", expiresAt);
  } else if (err) {
    // Handle errors
    console.log(err);
  }
});

class App extends Component {
  render() {
    document.body.style.background = "#88CCFF";
    if (this.isAuthenticated()) {
      return (
        <Container className="my-5 p-5">
          <h1 className="header">SMURF VILLAGE</h1>
          <h2>
            Welcome <span id="nick"> Smurf!</span>
          </h2>
          <SmurfList />
          <SmurfForm />
          <div onClick={this.logout}>LOG OUT</div>
        </Container>
      );
    } else {
      return (
        <div>
          <p>
            You are not authorized to view this content, please click below to
            LOGIN.
          </p>
          <div
            id="btn-login"
            onClick={function() {
              lock.show();
            }}
          >
            Login
          </div>
        </div>
      );
    }
  }
  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    window.location.reload();
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  componentDidMount() {
    this.props.getSmurfs();
  }
}

export default connect(
  null,
  { getSmurfs }
)(App);
