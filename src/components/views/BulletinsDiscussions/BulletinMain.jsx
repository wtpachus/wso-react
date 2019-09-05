// React imports
import React from "react";
import PropTypes from "prop-types";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";

const BulletinMain = ({ route, navigateTo }) => {
  const BulletinBody = (bulletinType) => {
    return <BulletinIndex type={bulletinType} />;
  };

  // Check that this is a valid route with 'type' params
  if (route.params && route.params.type) {
    // Check that the type is valid
    const validBulletinTypes = [
      "lostAndFound",
      "ride",
      "job",
      "exchange",
      "announcement",
    ];

    if (validBulletinTypes.indexOf(route.params.type) !== -1) {
      return (
        <BulletinLayout type={route.params.type}>
          {BulletinBody(route.params.type)}
        </BulletinLayout>
      );
    }
  }

  navigateTo("home");
  return null;
};

BulletinMain.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

BulletinMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("/");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletinMain);
