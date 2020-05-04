// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { connect } from "react-redux";
import {
  doUpdateToken,
  doUpdateUser,
  doUpdateRemember,
  doUpdateAPI,
} from "../actions/auth";
import { actions } from "redux-router5";

// External imports
import { SimpleAuthentication } from "wso-api-client";
import { getAPI } from "../selectors/auth";

const Login = ({
  api,
  navigateTo,
  updateAPI,
  updateRemember,
  updateToken,
  updateUser,
}) => {
  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");
  const [errors, updateErrors] = useState([]);
  const [remember, setRemember] = useState(true);

  const unixHandler = (event) => {
    const splitValue = event.target.value.split("@");
    setUnix(splitValue[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Guard clause for empty id or password field.
    if (unixID === "" || password === "") {
      updateErrors(["Please enter a valid unixID and password."]);
      return;
    }

    try {
      const token = await api.authService.loginV1({
        unixID,
        password,
      });
      const updatedAuth = new SimpleAuthentication(token.token);
      const updatedAPI = api.updateAuth(updatedAuth);
      const userResponse = await updatedAPI.userService.getUser("me");
      updateUser(userResponse.data);
      updateRemember(remember);
      updateAPI(updatedAPI);
      updateToken(token);
      navigateTo("home");
    } catch (error) {
      if (error.errors) {
        updateErrors(error.errors);
      }
    }
  };
  return (
    <header>
      <div className="page-head">
        <h1>Login</h1>
        <ul>
          <li>
            <a href="https://pchanger.williams.edu/pchecker/">
              Forgot My Password
            </a>
          </li>
        </ul>
      </div>

      <form onSubmit={submitHandler}>
        <div id="errors">
          {errors && errors.map((msg) => <p key={msg}>{msg}</p>)}
        </div>
        <br />
        <input
          type="text"
          id="unixID"
          placeholder="Enter your unix"
          onChange={unixHandler}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="remember_me">
          <input
            type="checkbox"
            id="remember_me"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Remember me
        </label>
        <input
          type="submit"
          name="commit"
          value="Login"
          className="submit"
          data-disable-with="Login"
        />
      </form>
    </header>
  );
};

Login.propTypes = {
  api: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateAPI: PropTypes.func.isRequired,
  updateRemember: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    api: getAPI(state),
  });
};
const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  updateAPI: (api) => dispatch(doUpdateAPI(api)),
  updateRemember: (remember) => dispatch(doUpdateRemember(remember)),
  updateToken: (response) => dispatch(doUpdateToken(response)),
  updateUser: (unixID) => dispatch(doUpdateUser(unixID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
