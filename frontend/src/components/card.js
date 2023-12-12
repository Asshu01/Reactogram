import React, { useState } from "react";
import "./card.css";
import axios from "axios";
import { API_BASE_URL } from "../../src/config";

import { useSelector } from "react-redux";

const Card = (props) => {
  const user = useSelector((state) => state.userReducer);

  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const isUserLikedPost = props.postData.likes.some(
    (like) => like === user.user._id
  );

  const likeButtonStyle = {
    color: isUserLikedPost ? "red" : "black", // Change color based on whether user liked the post
  };

  const getAgoTime = () => {
    //get ago time in nearest largest minimum value unit
    const postDate = new Date(props.postData.createdAt);
    const now = new Date();
    const diff = Math.abs(now - postDate);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return years + " years ago";
    } else if (months > 0) {
      return months + " months ago";
    } else if (days > 0) {
      return days + " days ago";
    } else if (hours > 0) {
      return hours + " hrs ago";
    } else if (minutes > 0) {
      return minutes + " min ago";
    } else {
      return "Just now";
    }
  };

  const submitComment = async (postId) => {
    setCommentBox(false);
    const request = { postId: postId, commentText: comment };
    const response = await axios.put(
      `/comment`,
      request,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      props.getAllPosts();
    }
  };
  const likedislikePost = async (postId, type) => {
    if (!isUserLikedPost && type === "like") {
      const request = { postId: postId };
      const response = await axios.put(
        `/like`,
        request,
        CONFIG_OBJ
      );
      if (response.status === 200) {
        props.getAllPosts();
      }
    } else if (isUserLikedPost && type === "unlike") {
      const request = { postId: postId };
      const response = await axios.put(
        `/unlike`,
        request,
        CONFIG_OBJ
      );
      if (response.status === 200) {
        props.getAllPosts();
      }
    }
  };

  return (
    <>
      <div className="cards shadow-sm">
        <div className="card-body px-2 ">
          <div className="row">
            <div className="col-6 d-flex">
              <img
                src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="img"
                className="profile-pic p-2"
              ></img>
              <div className="mt-2">
                <p className="fs-6 fw-bold">{props.postData.author.fullName}</p>
                <p className="location ">{props.postData.location}</p>
              </div>
            </div>
            {props.postData.author._id == user.user._id ? (
              <div className="col-6">
                <i
                  onClick={() => props.deletePost(props.postData._id)}
                  style={{ cursor: "pointer" }}
                  className="float-end fs-3 p-2 mt-3 fa-solid fa-ellipsis-vertical"
                ></i>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row">
            <div className="col-12">
              <img
                alt={props.postData.description}
                className="p-2 img-fluid rounded"
                src={props.postData.image}
              />
            </div>
          </div>
          <div className="row my-3">
            <div className="col-6 d-flex">
              <i
                onClick={() => likedislikePost(props.postData._id, "like")}
                className="ps-2 fa-regular fa-thumbs-up"
                style={likeButtonStyle}
              ></i>
              <i
                onClick={() => likedislikePost(props.postData._id, "unlike")}
                className="ps-2 fa-regular fa-thumbs-down"
              ></i>
              <i
                onClick={() => setCommentBox(true)}
                className="ps-2 fs-4 fa-regular fa-comment"
              ></i>
            </div>
            <div className="col-6">
              <span className="pd-2 fs-6 fw-bold float-end">
                {props.postData.likes.length} likes
              </span>
            </div>
          </div>
          {commentBox && (
            <div className="row mb-2">
              <div className="col-8">
                <textarea
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control"
                  placeholder="Add a comment"
                ></textarea>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-primary"
                  onClick={() => submitComment(props.postData._id)}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {props.postData.comments.map((comment) => {
            return (
              <div className="row">
                <div className="col-12">
                  <p>
                    {comment.commentText} -{" "}
                    <span className="fw-bold">
                      {comment.commentedBy.fullName}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
          <div className="row">
            <div className="col-12">
              <span className="p-2 text-muted">{getAgoTime()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
