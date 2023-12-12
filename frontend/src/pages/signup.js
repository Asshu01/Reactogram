import React, { useState } from "react";
import "./signup.css";
import desktop from "../images/social-desktop.PNG";
import mobile from "../images/social-mobile.PNG";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../src/config";
import Swal from "sweetalert2";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const signupHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = {
      fullName: fullName,
      email: email,
      password: password,
    };
    axios
      .post(`/signup`, requestData)
      .then((result) => {
        if (result) {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "User Successfully Registered",
          });
        }
        setEmail("");
        setFullName("");
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
          <div className="col-md-5  col-sm-12 text-center">
            <div className="card shadow">
              <div className="card-body px-5">
                <h5 className="card-title text-center mt-3 fw-bold">Sign Up</h5>
                <form onSubmit={(e) => signupHandler(e)}>
                  {/* <input
                    type="text"
                    className="p-2 mt-4 mb-2 form-control input-bg"
                    placeholder="Phone"
                  /> */}
                  <input
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="p-2 mb-2 form-control input-bg"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(ev) => setFullName(ev.target.value)}
                    className="p-2 mb-2 form-control input-bg"
                    placeholder="Full Name"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="p-2 mb-2 form-control input-bg"
                    placeholder="Password"
                  />
                  {loading ? (
                    <div className=" col-sm-12 mt-3 text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 d-grid">
                      <button
                        className="custom-btn custom-btn-blue"
                        type="submit"
                      >
                        Sign Up
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
                        Already have an account?
                      </span>
                      <Link to="/login" className="ms-1 text-info fw-bold">
                        {" "}
                        Log In
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

export default Signup;
