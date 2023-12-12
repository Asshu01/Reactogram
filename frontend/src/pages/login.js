import React, { useState } from "react";
import "./login.css";
import desktop from "../images/social-desktop.PNG";
import mobile from "../images/social-mobile.PNG";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../src/config";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = {
      email: email,
      password: password,
    };
    axios
      .post(`/login`, requestData)
      .then((result) => {
        if (result.status === 200) {
          setLoading(false);
          console.log(result);
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.userInfo));
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: result.data.userInfo,
          });
          navigate("/profile");
          Swal.fire({
            icon: "success",
            title: "User Successfully Logged In",
          });
        }
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Some Error Occured try again later",
        });
      });
  };
  return (
    <div>
      <div className="container login-container">
        <div className="row">
          <div className="col-md-7 col-sm-12 d-flex justify-content-center align-item-center">
            <img
              className="desktop"
              style={{ height: "85%" }}
              src={desktop}
              alt="img"
            />
            <img className="mobile" src={mobile} alt="img" />
          </div>
          <div className="col-md-5  col-sm-12">
            <div className="card shadow">
              <div className="card-body px-5">
                <h5 className="card-title text-center mt-3 fw-bold">
                  Login In
                </h5>
                <form onSubmit={(ev) => loginHandler(ev)}>
                  <input
                    type="email"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="p-2 mt-4 mb-2 form-control input-bg"
                    placeholder="Phone number , username, or email"
                  />
                  <input
                    type="password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="p-2 mb-2 form-control input-bg"
                    placeholder="Password"
                  />
                  {loading ? (
                    <div className=" col-sm-12 mt-3 text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 d-grid">
                      <button
                        type="submit"
                        className="custom-btn custom-btn-blue"
                      >
                        Log In
                      </button>
                    </div>
                  )}
                  <div className="my-4">
                    <hr className="text-muted" />
                    <h5 className="text-muted text-center">OR</h5>
                    <hr className="text-muted" />
                  </div>
                  <div className="mt-3 mb d-grid">
                    <button className="custom-btn custom-btn-white">
                      <span className="text-muted fs-6">
                        Don't have an account?
                      </span>
                      <Link to="/signup" className="ms-1 text-info fw-bold">
                        {" "}
                        Sign Up
                      </Link>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
