// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component imports
import { bulletinList } from "./Homepage.module.scss";
import BulletinBox from "./Bulletins/BulletinBox";

// Redux Imports
import { connect } from "react-redux";
import { actions } from "redux-router5";

const Homepage = ({ navigateTo }) => {
  const bulletinTypeWords = [
    "Discussions",
    "Announcements",
    "Exchanges",
    "Lost And Found",
    "Jobs",
    "Rides",
  ];
  const [query, updateQuery] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("facebook", { q: query }, { reload: true });
  };

  return (
    <div className="home">
      <div className="full-width">
        <header>
          <div className="logo">
            <h2 align="center" id="logotype">
              WSO
            </h2>
            <h4 align="center" id="tagline">
              By Students, For Students!
            </h4>
          </div>
          <br />
          <form onSubmit={submitHandler}>
            <input
              aria-label="Search box for Facebook"
              type="search"
              placeholder="Search Facebook"
              onChange={(event) => updateQuery(event.target.value)}
            />
            <input
              data-disable-with="Search"
              type="submit"
              value="Search"
              className="submit"
            />
          </form>
        </header>
        <article>
          <section>
            <div className={bulletinList}>
              {bulletinTypeWords.map((bulletin) => {
                return <BulletinBox typeWord={bulletin} key={bulletin} />;
              })}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

Homepage.propTypes = { navigateTo: PropTypes.func.isRequired };

Homepage.defaultProps = {};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(null, mapDispatchToProps)(Homepage);
