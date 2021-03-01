/* eslint no-alert:off */
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'cookies';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      id: '',
      pwd: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.lastLoginAttempt = 0;
  }

  componentDidMount() {
    const { onLoginAttempt } = this.props;
    const id = Cookies.get('username');
    const pwd = Cookies.get('pwd');

    if (id && pwd) {
      this.showThrobber();
      onLoginAttempt(id, pwd);
    }
  }

  /**
   * Show the loading spinner
   */
  showThrobber() {
    this.setState({
      showThrobber: true,
    });
  }

  /**
   * Hides the loading spinner
   */
  hideThrobber() {
    this.setState({
      showThrobber: false,
    });
  }

  /**
   * Event listener – Gets called when form is sent
   * @param {object} e The event object
   */ 
  onSubmit(e) {
    e.preventDefault();

    const { id, pwd } = this.state;
    const { onLoginAttempt } = this.props;
    const timeout = 10; // Timeout in seconds
    const now = (new Date()).getTime() / 1000;

    if (now - timeout > this.lastLoginAttempt) {
      if (id && pwd) {
        if (typeof onLoginAttempt === 'function') {
          this.showThrobber();
          try {
            onLoginAttempt(id, pwd)
            .on('complete', () => {
              Cookies.set('username', id, 1);
              Cookies.set('pwd', pwd, 1);
              this.hideThrobber();
            })
            .on('error', () => {
              this.lastLoginAttempt = (new Date()).getTime() / 1000;
              this.hideThrobber();
              alert('Login failed');
            });
          } catch(e) {
            this.hideThrobber();
          }
        } else {
          this.hideThrobber();
        }
      } else {
        this.hideThrobber();
        alert('Please enter username and password');
      }
    } else {
      this.hideThrobber();
      alert('Your last login failed. Please wait a few seconds for your next try.');
    }
  }

  render() {
    const { id, pwd, showThrobber } = this.state;
    const throbberVisibility = showThrobber === true ? { display: 'inline-block' } : { display: 'none' };

    return (
      <form id="login" onSubmit={this.onSubmit}>
        User
        <br />
        <input
          value={id}
          onChange={(e) => { this.setState({ id: e.target.value }); }}
        />
        <br />
        <br />
        Password
        <br />
        <input
          type="password"
          value={pwd}
          onChange={(e) => { this.setState({ pwd: e.target.value }); }}
        />
        <br />
        <br />
        <input style={{ backgroundColor: '#fff' }} type="submit" value="Login" />
        <img style={{ marginLeft: '10px', width: '30px', ...throbberVisibility }} src="img/throbber.svg" alt="" />
      </form>
    );
  }
}

Login.propTypes = {
  onLoginAttempt: PropTypes.func,
};

Login.defaultProps = {
  onLoginAttempt: () => {},
};
