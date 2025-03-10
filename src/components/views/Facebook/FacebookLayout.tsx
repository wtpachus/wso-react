// React imports
import React, { useState, useEffect } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const FacebookLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useState("");

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateQuery(searchParams.get("q") ?? "");
    } else {
      updateQuery("");
    }
  }, [searchParams]);

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchParams.set("q", query);
    navigateTo(`/facebook?${searchParams.toString()}`);
  };

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/facebook">Facebook</Link>
          </h1>
          <ul>
            <li>
              <Link to="/facebook">Search</Link>
            </li>
            <li>
              <Link to="/facebook/help">Help</Link>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="view">
                    <Link to={`/facebook/users/${currUser.id}`}>View</Link>
                  </li>,
                  <li key="edit">
                    <Link to="/facebook/edit"> Edit </Link>
                  </li>,
                ]}
          </ul>
        </div>
        <form onSubmit={submitHandler}>
          <input
            id="search"
            type="search"
            placeholder="Search Facebook"
            autoFocus
            onChange={(event) => updateQuery(event.target.value)}
            value={query}
          />
          <input
            data-disable-with="Search"
            type="submit"
            value="Search"
            className="submit"
          />
        </form>
      </header>
      {children}
    </div>
  );
};

export default FacebookLayout;
