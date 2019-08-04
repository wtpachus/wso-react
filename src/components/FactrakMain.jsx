// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import FactrakHome from "./FactrakHome";
import FactrakPolicy from "./FactrakPolicy";
import FactrakModerate from "./FactrakModerate";
import FactrakLayout from "./FactrakLayout";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../selectors/auth";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const FactrakMain = ({ route }) => {
  const factrakBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <FactrakHome />;

    console.log(splitRoute[1]);
    switch (splitRoute[1]) {
      case "policy":
        return <FactrakPolicy />;
      case "surveys":
        return <FactrakPolicy />;
      case "moderate":
        return <FactrakModerate />;
      default:
        return <FactrakHome />;
    }
  };

  return <FactrakLayout>{factrakBody()}</FactrakLayout>;
};

FactrakMain.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.object),
};

FactrakMain.defaultProps = {
  areas: [{ name: "hi", id: "1" }],
  route: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakMain);
