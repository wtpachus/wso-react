// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import {
  getProfessors,
  getCourses,
  getAreaOfStudy,
} from "../../../api/factrak";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakAOS = ({ route, token }) => {
  const [courses, updateCourses] = useState([]);
  const [profs, updateProfs] = useState([]);
  const [area, updateArea] = useState({});

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const areaParam = route.params.area;

    const loadProfs = async (areaOfStudyID) => {
      const params = { areaOfStudyID };
      const profsResponse = await getProfessors(token, params);
      if (checkAndHandleError(profsResponse)) {
        updateProfs(profsResponse.data.data);
      }
    };

    const loadCourses = async (areaOfStudyID) => {
      const params = { areaOfStudyID, preload: ["professors"] };
      const coursesResponse = await getCourses(token, params);
      if (checkAndHandleError(coursesResponse)) {
        const coursesData = coursesResponse.data.data;
        updateCourses(coursesData.sort((a, b) => a.number > b.number));
      }
    };

    const loadAOS = async (areaID) => {
      const areaOfStudyResponse = await getAreaOfStudy(token, areaID);
      if (checkAndHandleError(areaOfStudyResponse)) {
        updateArea(areaOfStudyResponse.data.data);
      }
    };

    loadProfs(areaParam);
    loadCourses(areaParam);
    loadAOS(areaParam);
  }, [route.params.area, token]);

  return (
    <article className="factrak-home">
      <section className="margin-vertical-small">
        <h3>{area && area.name ? area.name : ""}</h3>
        {profs.length > 0 ? (
          <>
            <br />
            <h4>{`Professors in ${area && area.name ? area.name : ""}`}</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th className="unix-column">Unix</th>
                </tr>
              </thead>
              <tbody>
                {profs.map((prof) => (
                  <tr key={prof.id}>
                    <td>
                      <Link
                        routeName="factrak.professors"
                        routeParams={{ profID: prof.id }}
                      >
                        {prof.name}
                      </Link>
                    </td>

                    <td>{prof.title}</td>
                    <td>
                      <a href={`mailto:${prof.unixID}@williams.edu`}>
                        {prof.unixID}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </section>

      <section className="margin-vertical-small">
        <h4>Courses</h4>
        <table>
          <thead>
            <tr>
              <th className="col-20">Course</th>
              <th className="col-80">Professors</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="col-20">
                  <Link
                    routeName="factrak.courses"
                    routeParams={{ courseID: course.id }}
                  >
                    {`${area.abbreviation} ${course.number}`}
                  </Link>
                </td>
                <td className="col-80">
                  {course.professors &&
                    course.professors
                      .map((prof) => {
                        return (
                          <Link
                            routeName="factrak.courses.singleProf"
                            routeParams={{
                              courseID: course.id,
                              profID: prof.id,
                            }}
                            key={prof.id}
                          >
                            {prof.name}
                          </Link>
                        );
                      })
                      .reduce((prev, curr) => [prev, ", ", curr])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
};

FactrakAOS.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.areasOfStudy");

  return (state) => ({
    token: getToken(state),
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
)(FactrakAOS);
