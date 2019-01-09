/*global gapi*/
import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { b, createBlock } from '../../helpers/bem';
import './Login.css';

const block = createBlock('Login');

const REACT_APP_OAuth_CLIENT_ID =
  '545450253515-val7uv3uemioqjh2javrfosd95tvfdda.apps.googleusercontent.com';

class Login extends Component {
  responseSuccess = response => {
    if (!localStorage.getItem(`${response.googleId}`)) {
      let userData = { ...response.profileObj };
      userData.searchHistory = [];
      userData.venues = [];
      localStorage.setItem(`${response.googleId}`, JSON.stringify(userData));
      localStorage.setItem('active', response.googleId);
      this.props.userLogin(response.profileObj);
    } else {
      let user = JSON.parse(localStorage.getItem(`${response.googleId}`));
      localStorage.setItem('active', response.googleId);
      this.props.userLogin(user);
    }
  };
  responseError = response => {
    console.log(response);
  };
  logout = () => {
    localStorage.removeItem('active');
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log('User signed out.');
    });
    this.props.userLogout();
  };

  render() {
    return (
      <div className={b(block)}>
        <GoogleLogin
          clientId={REACT_APP_OAuth_CLIENT_ID}
          buttonText="Login"
          className={this.props.user ? b(block, 'none') : b(block, 'Login-btn')}
          fetchBasicProfile={true}
          onSuccess={this.responseSuccess}
          onFailure={this.responseError}
        />
        <GoogleLogout
          buttonText="Logout"
          className={
            this.props.user ? b(block, 'logout-btn') : b(block, 'none')
          }
          onLogoutSuccess={this.logout}
        />
      </div>
    );
  }
}

export default Login;
