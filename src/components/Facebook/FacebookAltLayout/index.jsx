// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import {
  EuiButton,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormControlLayout,
} from "@elastic/eui";
import styles from "./FacebookAltLayout.module.scss";

const FacebookAltLayout = ({ children, currUser, navigateTo, route }) => {
  const [query, updateQuery] = useState("");

  useEffect(() => {
    if (route.params.q) {
      updateQuery(route.params.q);
    } else {
      updateQuery("");
    }
  }, [route.params.q]);

  // Handles submissions
  const submitHandler = (event) => {
    event.preventDefault();
    navigateTo("facebook", { q: query });
  };

  return (
    <article>
      <header>
        <EuiFlexGrid className={styles.facebook}>
          <EuiFlexItem className={styles.title}>
            <h1>
              <Link routeName="facebook">Facebook</Link>
            </h1>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <article className={styles.search}>
              <form onSubmit={submitHandler}>
                <EuiFlexGroup>
                  <EuiFlexItem grow={false}>
                    <EuiFormControlLayout
                      icon="search"
                      className={styles.formControlLayout}
                    >
                      <input
                        id="search"
                        type="search"
                        placeholder="Search Facebook"
                        autoFocus
                        onChange={(event) => updateQuery(event.target.value)}
                        value={query}
                      />
                    </EuiFormControlLayout>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      data-disable-with="Search"
                      type="submit"
                      value="Search"
                      className="submit"
                      style={{
                        backgroundColor: "#644a98",
                        border: "#644a98",
                        color: "#efdfff",
                      }}
                    >
                      Search
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </form>
            </article>
            <br />
            <article className={styles.options}>
              <EuiFlexItem grow={false}>
                {currUser && (
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: currUser.id }}
                  >
                    My Profile
                  </Link>
                )}
              </EuiFlexItem>
            </article>
          </EuiFlexItem>
        </EuiFlexGrid>
        <hr />
      </header>
      {children}
    </article>
  );
};

FacebookAltLayout.propTypes = {
  children: PropTypes.object,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

FacebookAltLayout.defaultProps = {
  children: {},
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookAltLayout);
