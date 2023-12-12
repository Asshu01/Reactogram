import React, { useState, useEffect } from "react";
import "./profile.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../src/config";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import "../components/card.css";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.userReducer);

  const navigate = useNavigate();

  const [image, setImage] = useState({ preview: "", data: "" });
  const [myallposts, setMyallposts] = useState([]);

  const [postDetail, setPostDetail] = useState({});

  const [show, setShow] = useState(false);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const [showPost, setShowPost] = useState(false);

  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const deletePost = async (postId) => {
    const response = await axios.delete(
      `/deletepost/${postId}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      getMyPosts();
      setShow(false);
    }
  };

  const handleFileSelect = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  const handleIMGUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);

    const response = axios.post(`/uploadFile`, formData);
    return response;
  };
  const getMyPosts = async () => {
    const response = await axios.get(`/myallposts`, CONFIG_OBJ);
    if (response.status === 200) {
      setMyallposts(response.data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured while  getting all your post post",
      });
    }
  };
  const showDetail = (post) => {
    setPostDetail(post);
  };
  const addPost = async () => {
    if (image.preview === "") {
      Swal.fire({
        icon: "error",
        title: "Post Image is Mandatory!",
      });
    } else if (caption === "") {
      Swal.fire({
        icon: "error",
        title: "Post Image is Mandatory!",
      });
    } else if (location === "") {
      Swal.fire({
        icon: "error",
        title: "Post Image is Mandatory!",
      });
    } else {
      setLoading(true);
      const imgRes = await handleIMGUpload();
      //add validation rule for caption and location
      const request = {
        description: caption,
        location: location,
        image: `/files/${imgRes.data.fileName}`,
      };

      // post call api call
      const postResponse = await axios.post(
        `/createpost`,
        request,
        CONFIG_OBJ
      );
      setLoading(false);
      if (postResponse.status === 201) {
        navigate("/posts");
      } else {
        Swal.fire({
          icon: "error",
          title: "Some Error Occured while creating post",
        });
      }
    }
  };
  useEffect(() => {
    getMyPosts();
  }, []);
  return (
    <div className="container shadow mt-3 p-4">
      <div className="row">
        <div className="col-md-6 d-flex flex-column">
          <img
            className="p-2 profile-pic img-fluid"
            alt="profile pic"
            src="https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdpbnRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          />
          <p className="ms-3 fs-5 fw-bold">{user.user.fullName}</p>
          <p className="ms-3 fs-5">{user.user.email}</p>
          <p className="ms-3 fs-5">UI/UX Designer @john | Follow @johndoe</p>
          <p className="ms-3 fs-5">
            My portfolio on <a href="/">www.portfolio.com/john</a>
          </p>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between mt-3">
          <div className="d-flex justify-content-equal mx-auto">
            <div className="count-section pe-4 pe-md-5 text-center fw-bold">
              <h4>{myallposts.length}</h4>
              <p>Posts</p>
            </div>
            <div className="count-section px-4 px-md-5 text-center fw-bold">
              <h4>20</h4>
              <p>Followers</p>
            </div>
            <div className="ps-md-5 ps-4 text-center fw-bold">
              <h4>20</h4>
              <p>Following</p>
            </div>
          </div>
          <div className="mx-auto mt-md-0 mt-4">
            <button className="custom-btn custom-btn-white me-md-3">
              <span className="fs-6 text-black">Edit Profile</span>
            </button>
            <button
              className="custom-btn custom-btn-white"
              onClick={() => handlePostShow()}
            >
              <span className="fs-6 text-black">Upload Post</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <div className="col-12">
          <hr />
        </div>
      </div>
      <div className="row mb-4">
        {myallposts.map((post) => {
          return (
            <div className="col-md-4 col-sm-12" key={post._id}>
              <div className="card" onClick={handleShow}>
                <img
                  onClick={() => showDetail(post)}
                  src={post.image}
                  className="card-img-top"
                  alt={post.description}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div>
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="true"
                >
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    ></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        src={postDetail.image}
                        className="d-block w-100"
                        alt="img"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1532959727713-c8dfc3694649?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="d-block w-100"
                        alt="img"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1540635352372-c21b523a29c6?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="d-block w-100"
                        alt="img"
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="cards shadow-sm">
                <div className="card-body px-2 ">
                  <div className="row">
                    <div className="col-6 d-flex">
                      <img
                        src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="img"
                        className="profile-pic p-2"
                      ></img>
                      <div className="mt-2 ms-2">
                        <p className="fs-6 fw-bold">{postDetail.location}</p>
                        <p className="location ">{postDetail.description}</p>
                      </div>
                      <div className="dropdown ms-2">
                        <a
                          className="btn"
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                        >
                          <i className="float-end fs-7 p-1 mt-1 fa-solid fa-ellipsis-vertical"></i>
                        </a>

                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fa-regular fa-pen-to-square px-2"></i>
                              Edit Post
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => deletePost(postDetail._id)}
                            >
                              <i className="fa-regular fa-trash-can px-2"></i>
                              Delete Post
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <span className="p-2 text-muted">2 Hours Ago</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12 ms-2">
                      <p>Lorem Ipsum</p>
                    </div>
                  </div>
                  <div className="row my-3">
                    <div className="col-6 d-flex">
                      <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                      <i className="ps-2 fs-4 fa-regular fa-comment"></i>
                      <i className="ps-2 fs-4 fa-solid fa-location-arrow"></i>
                    </div>
                    <div className="col-12 mt-3 ms-2">
                      <span className="fs-6 fw-bold">200 likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPost} onHide={handlePostClose} size="lg" centerd="true">
        <Modal.Header closeButton>
          <span className="fs-5 fw-bold">Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              <div className="upload-box">
                <div className="dropZoneContainer upload-box d-flex flex-column justify-content-center align-items-center text-center">
                  <input
                    name="file"
                    type="file"
                    id="drop zone"
                    className="Fileupload"
                    accept=".jpg,.png,.gif"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="drop zone"
                    className="mb-0  upload-box d-flex flex-column justify-content-center align-items-center text-center"
                  >
                    {image && image.preview && (
                      <img
                        src={image.preview}
                        alt="img"
                        width="100"
                        height="100"
                      />
                    )}
                    <i
                      role="button"
                      className="fa-solid fa-cloud-arrow-up fs-2 text-center mb-2"
                    ></i>
                    <span role="button" className="fs-5">
                      Upload photo from your device
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6  col-sm-12 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Add Caption"
                      id="floatingTextarea"
                      onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                    <label htmlFor="floatingTextarea">Add Caption</label>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Add Location"
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <label htmlFor="floatingInput">
                      <i className="fa-solid fa-location-dot pe-2"></i>Add
                      Location
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  {loading ? (
                    <div className="col-md-12 mt-3 text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => addPost()}
                    className="custom-btn custom-btn-pink float-end"
                  >
                    <span className="fs-6 fw-600">Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
