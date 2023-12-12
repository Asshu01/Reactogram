import React from "react";
import "./navbar.css";
import logo from "../images/logo.PNG";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userReducer);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_FAILURE" });
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar  bg-light shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand ms-5" href="/">
            <img alt="logo" src={logo} height="45px"></img>
          </NavLink>
          <form
            className="form-inline me-md-5 w-55 d-flex align-items-center"
            role="search"
          >

              <input
                className="searchbox form-control me-2"
                type="search"
                placeholder="Search"
              />
            
             
              <NavLink className="nav-link mx-2 text-dark fs-5" to="/posts">
                <i className="fa-solid fa-house"></i>
              </NavLink>
            
            <a className="nav-link mx-2 text-dark fs-5 searchIcon" href="/">
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>
            {localStorage.getItem("token") != null ? (
              <NavLink className="nav-link mx-2 text-dark fs-5" href="#">
                <i className="fa-regular fa-heart"></i>
              </NavLink>
            ) : (
              ""
            )}
            <div className="dropdown">
              {localStorage.getItem("token") != null ? (
                <>
                {" "}
                  <a
                    className="btn"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="profilr-pic"
                      className="navbar-profile-pic"
                    />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="nav-link mt-0 p-2" to="/profile">
                        My Profile
                      </NavLink>
                    </li>
                    <li>
                      <a
                        className="dropdown-item p-2"
                        onClick={() => logoutHandler()}
                        href="#"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>{" "}
                </>
              ) : (
                ""
              )}
            </div>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
