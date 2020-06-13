// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";
import { Line } from "../../Skeleton";

// Redux and routing imports
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { connect } from "react-redux";

// Additional imports
import { Link } from "react-router5";
import { actions } from "redux-router5";
import { bulletinTypeRide } from "../../../constants/general";

const BulletinIndex = ({ currUser, navigateTo, type, wso }) => {
  const [bulletins, updateBulletins] = useState(null);
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const perPage = 20;
  const loadBulletins = async (newPage) => {
    const params = {
      type,
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
    };
    try {
      const bulletinsResponse = await wso.bulletinService.listBulletins(params);
      updateBulletins(bulletinsResponse.data);
      updateTotal(bulletinsResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  const loadRides = async (newPage) => {
    const params = {
      preload: ["user"],
      limit: 20,
      offset: perPage * newPage,
      // We don't generally need to add start as a param because the backend automatically
      // filters for only future rides.
    };
    try {
      const ridesResponse = await wso.bulletinService.listRides(params);
      updateBulletins(ridesResponse.data);
      updateTotal(ridesResponse.paginationTotal);
    } catch {
      navigateTo("500");
    }
  };

  // Loads the next page appropriately
  const loadNext = (newPage) => {
    // Different because the wso endpoints are different
    if (type === bulletinTypeRide) loadRides(newPage);
    else loadBulletins(newPage);
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      loadNext(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadNext(page + 1);
      updatePage(page + 1);
    }
  };

  // Handles selection of page
  const selectionHandler = (newPage) => {
    updatePage(newPage);
    loadNext(newPage);
  };

  useEffect(() => {
    loadNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, wso]);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  // Handles deletion
  const deleteHandler = async (event, bulletinID) => {
    event.preventDefault();
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (type === bulletinTypeRide) {
        await wso.bulletinService.deleteRide(bulletinID);
      } else {
        await wso.bulletinService.deleteBulletin(bulletinID);
      }
      loadNext(page);
    } catch {
      navigateTo("500");
    }
  };

  // Creates the Bulletin Title link
  const generateBulletinTitle = (bulletin) => {
    let title;

    if (type === bulletinTypeRide) {
      if (bulletin.offer) {
        title = `${bulletin.source} to ${bulletin.destination} (Offer)`;
      } else {
        title = `${bulletin.source} to ${bulletin.destination} (Request)`;
      }
    } else {
      title = bulletin.title;
    }

    return (
      <Link
        routeName="bulletins.show"
        routeParams={{ type, bulletinID: bulletin.id }}
        routeOptions={{ reload: true }}
      >
        {title}
      </Link>
    );
  };

  // Generate Bulletin date
  const generateBulletinDate = (bulletin) => {
    if (type === bulletinTypeRide) {
      return new Date(bulletin.date).toLocaleDateString("en-US", dateOptions);
    }

    return new Date(bulletin.startDate).toLocaleDateString(
      "en-US",
      dateOptions
    );
  };

  // Link to edit bulletin
  const editLink = (bulletin) => {
    if (currUser && currUser.id === bulletin.user.id) {
      return (
        <>
          <Link
            routeName="bulletins.edit"
            routeParams={{ bulletinID: bulletin.id, type }}
          >
            Edit
          </Link>
          &nbsp;|&nbsp;
        </>
      );
    }
    return null;
  };

  // Edit/Delete Links
  const editDeleteLinks = (bulletin) => {
    if (currUser && (currUser.id === bulletin.user.id || currUser.admin)) {
      return (
        <>
          &nbsp;[&nbsp;
          {editLink(bulletin)}
          <Link
            routeName="bulletins"
            routeParams={{ type }}
            onClick={(event) => deleteHandler(event, bulletin.id)}
          >
            Delete
          </Link>
          &nbsp;]
        </>
      );
    }
    return null;
  };

  // Populate Bulletin
  const generateBulletin = (bulletin) => {
    return (
      <tr key={bulletin.id}>
        <td className="col-60">
          {generateBulletinTitle(bulletin)}
          {editDeleteLinks(bulletin)}
        </td>
        <td className="col-20">{bulletin.user.name}</td>
        <td className="col-20">{generateBulletinDate(bulletin)}</td>
      </tr>
    );
  };

  const bulletinSkeleton = (key) => (
    <tr key={key}>
      <td className="col-60">
        <Line width="70%" />
      </td>
      <td className="col-20">
        <Line width="80%" />
      </td>
      <td className="col-20">
        <Line width="80%" />
      </td>
    </tr>
  );

  // Generate Bulletin Table
  const generateBulletinTable = () => {
    if (bulletins && bulletins.length === 0) {
      return <h1 className="no-posts">No Posts</h1>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th className="col-60">Summary</th>
            <th className="col-6020">Posted by</th>
            <th className="col-20">Date</th>
          </tr>
        </thead>
        <tbody>
          {bulletins
            ? bulletins.map((bulletin) => generateBulletin(bulletin))
            : [...Array(20)].map((_, i) => bulletinSkeleton(i))}
        </tbody>
      </table>
    );
  };

  return (
    <article className="main-table">
      <section>
        <PaginationButtons
          selectionHandler={selectionHandler}
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
          showPages
        />
        {generateBulletinTable()}

        <PaginationButtons
          selectionHandler={selectionHandler}
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
          showPages
        />
      </section>
    </article>
  );
};

BulletinIndex.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

BulletinIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BulletinIndex);
