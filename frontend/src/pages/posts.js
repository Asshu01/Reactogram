import React, { useState, useEffect } from "react";
import Card from "../components/card";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";

const Postoverview = () => {
  const [allpost, setAllposts] = useState([]);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const getAllPosts = async () => {
    const response = await axios.get(`/allposts`);
    //debugger;
    if (response.status === 200) {
      setAllposts(response.data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured while  getting post",
      });
    }
  };
  const deletePost = async (postId) => {
    const response = await axios.delete(
      `/deletepost/${postId}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      getAllPosts();
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="container mt-md-5 mt-3">
      <div className="row">
        {allpost.length === 0 && (
          <div className="col-md-12">
            <h3 className="text-center">No Post Found</h3>
          </div>
        )}
        {allpost.map((post) => {
          return (
            <div className="col-md-4 mb-2" key={post._id}>
              <Card
                postData={post}
                deletePost={deletePost}
                getAllPosts={getAllPosts}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postoverview;
