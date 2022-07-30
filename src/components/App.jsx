// React imports
import React, { Suspense, lazy, useEffect, useState } from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";

// Redux/routing
import { connect } from "react-redux";
// import { createRouteNodeSelector, actions } from "redux-router5";
import {
  getWSO,
  getExpiry,
  getIdentityToken,
  getAPIToken,
} from "../selectors/auth";
import {
  doRemoveCreds,
  doUpdateAPIToken,
  doUpdateIdentityToken,
  doUpdateUser,
  doUpdateWSO,
} from "../actions/auth";
import { doUpdateSchedulerState } from "../actions/schedulerUtils";

import { Routes, Route } from "react-router-dom";

// Additional Imports
import { SimpleAuthentication } from "wso-api-client";
import { loadState } from "../stateStorage";
import configureInterceptors from "../lib/auth";
import jwtDecode from "jwt-decode";

// More component imports
const Scheduler = lazy(() => import("./views/CourseScheduler/Scheduler"));
const About = lazy(() => import("./views/Misc/About"));
const FAQ = lazy(() => import("./views/Misc/FAQ"));
const MobilePrivacyPolicy = lazy(() =>
  import("./views/Misc/MobilePrivacyPolicy")
);
const FacebookMain = lazy(() => import("./views/Facebook/FacebookMain"));
const DormtrakMain = lazy(() => import("./views/Dormtrak/DormtrakMain"));
const FactrakMain = lazy(() => import("./views/Factrak/FactrakMain"));
const EphmatchMain = lazy(() => import("./views/Ephmatch/EphmatchMain"));
const GoodrichMain = lazy(() => import("./views/Goodrich/GoodrichMain"));
const Error404 = lazy(() => import("./views/Errors/Error404"));
const Login = lazy(() => import("./Login"));
const Error403 = lazy(() => import("./views/Errors/Error403"));
const Error500 = lazy(() => import("./views/Errors/Error500"));
const Error = lazy(() => import("./views/Errors/Error"));
const BulletinMain = lazy(() =>
  import("./views/BulletinsDiscussions/BulletinMain")
);
const DiscussionMain = lazy(() =>
  import("./views/BulletinsDiscussions/DiscussionMain")
);

const App = ({
  apiToken,
  identityToken,
  // navigateTo,
  // route,
  updateAPIToken,
  updateIdenToken,
  updateSchedulerState,
  updateUser,
  updateWSO,
  wso,
}) => {
  const [initialized, setInitialized] = useState(false);

  const getIPIdentityToken = async () => {
    try {
      const tokenResponse = await wso.authService.getIdentityToken({
        useIP: true,
      });
      const newIdenToken = tokenResponse.token;
      updateIdenToken(newIdenToken);
    } catch (error) {
      // navigateTo("error", { error }, { replace: true });
    }
  };

  useEffect(() => {
    const randomWSO = async () => {
      if (document.title === "WSO: Williams Students Online") {
        try {
          const wsoResponse = await wso.miscService.getWords();
          document.title = `WSO: ${wsoResponse.data}`;
        } catch {
          // Do nothing - it's fine to gracefully handle this with the default title
        }
      }
    };

    const initialize = async () => {
      const persistedSchedulerOptions = loadState("schedulerOptions");
      updateSchedulerState(persistedSchedulerOptions.schedulerUtilState);
      const persistedToken = loadState("state")?.authState?.identityToken;
      if (persistedToken) {
        updateIdenToken(persistedToken);
      } else {
        await getIPIdentityToken();
      }

      setInitialized(true);
    };

    initialize();
    randomWSO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Each time identityToken is updated, we query for the new API token, update the API and
   * authentication that we use.
   */
  useEffect(() => {
    let isMounted = true;
    const updateAPI = async () => {
      if (identityToken !== "") {
        try {
          const apiTokenResponse = await wso.authService.getAPIToken(
            identityToken
          );
          const newAPIToken = apiTokenResponse.token;

          const auth = new SimpleAuthentication(newAPIToken);
          const updatedWSO = wso.updateAuth(auth);
          configureInterceptors(updatedWSO);

          if (isMounted) {
            updateAPIToken(newAPIToken);
            updateWSO(updatedWSO);
          }
        } catch (error) {
          // navigateTo("error", { error }, { replace: true });
        }
      } else {
        getIPIdentityToken();
      }
    };
    if (initialized) {
      updateAPI();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityToken, initialized]);

  /**
   * Each time the authentication mechanism/ API is updated, see if we need to update the current
   * user information.
   */
  useEffect(() => {
    let isMounted = true;
    const updateUserInfo = async () => {
      if (apiToken !== "") {
        try {
          const decoded = jwtDecode(apiToken);
          if (decoded?.tokenLevel === 3) {
            const userResponse = await wso.userService.getUser("me");
            if (isMounted) {
              updateUser(userResponse.data);
            }
          }
        } catch (error) {
          // navigateTo("error", { error }, { replace: true });
        }
      }
    };

    updateUserInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wso]);

  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="about" element={<About />} />
          <Route path="schedulecourses" element={<Scheduler />} />
          <Route path="facebook/*" element={<FacebookMain />} />
          {/* TODO: Add more routes */}
          {/* catch-all 404 page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

App.propTypes = {
  apiToken: PropTypes.string.isRequired,
  identityToken: PropTypes.string.isRequired,
  // navigateTo: PropTypes.func.isRequired,
  // route: PropTypes.object.isRequired,
  updateAPIToken: PropTypes.func.isRequired,
  updateIdenToken: PropTypes.func.isRequired,
  updateSchedulerState: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateWSO: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  // const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    apiToken: getAPIToken(state),
    expiry: getExpiry(state),
    identityToken: getIdentityToken(state),
    wso: getWSO(state),
    // ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  // navigateTo: (location, params, opts) =>
  //   dispatch(actions.navigateTo(location, params, opts)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateAPIToken: (token) => dispatch(doUpdateAPIToken(token)),
  updateSchedulerState: (newState) =>
    dispatch(doUpdateSchedulerState(newState)),
  updateIdenToken: (token) => dispatch(doUpdateIdentityToken(token)),
  updateUser: (newUser) => dispatch(doUpdateUser(newUser)),
  updateWSO: (wso) => dispatch(doUpdateWSO(wso)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
