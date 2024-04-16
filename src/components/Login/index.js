import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isLoginFailure: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginFailure = errMsg => {
    this.setState({errorMsg: errMsg, isLoginFailure: true})
  }

  validateCredentials = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.loginSuccess(fetchedData.jwt_token)
    } else {
      this.loginFailure(fetchedData.error_msg)
    }
  }

  render() {
    const {errorMsg, isLoginFailure, username, password} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-section">
        <form className="login-card" onSubmit={this.validateCredentials}>
          <div className="login-logo-name">
            <img
              className="login-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="username" className="loginlabel">
              USERNAME
            </label>
            <input
              id="username"
              className="input"
              type="text"
              placeholder="Username"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="input-cont">
            <label htmlFor="password" className="loginlabel">
              PASSWORD
            </label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <div className="loginbtn-cont">
            <button className="login-btn" type="submit">
              Login
            </button>
            {isLoginFailure ? <p className="err-msg">{errorMsg}</p> : null}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
