const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");
const protectedRoute = require("../middleware/protectedResourse");
//all user posts
router.get("/allposts", (req, res) => {
  PostModel.find()
    .populate("author", "_id fullName profile_pic")
    .populate("comments.commentedBy", "_id fullName")
    .then((dbPosts) => {
      res.status(200).json({ posts: dbPosts });
    })
    .catch((error) => {
      console.log(error);
    });
});

//all posts only from logged in user
router.get("/myallposts", protectedRoute, (req, res) => {
  PostModel.find({ author: req.user._id })
    .populate("author", "_id fullName profile_pic")
    .then((dbPosts) => {
      res.status(200).json({ posts: dbPosts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/createpost", protectedRoute, (req, res) => {
  const { description, location, image } = req.body;
  if (!description || !location || !image) {
    return res
      .status(400)
      .json({ error: "One or more mandatory fields are empty" });
  }
  req.user.password = undefined;
  const postObj = new PostModel({
    description: description,
    location: location,
    image: image,
    author: req.user,
  });
  postObj
    .save()
    .then((newPost) => {
      res.status(201).json({ message: "saved successfully", post: newPost });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
  try {
    const postFound = await PostModel.findOne({
      _id: req.params.postId,
    }).populate("author", "id");

    if (!postFound) {
      return res.status(400).json({ error: "Post doesn't exist" });
    }

    // Check if the post author is the same as the logged-in user, then allow deletion
    if (postFound.author._id.toString() === req.user._id.toString()) {
      await PostModel.deleteOne({ _id: req.params.postId });
      res.status(200).json({ result: "Post deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/like", protectedRoute, async (req, res) => {
  try {
    const postFound = await PostModel.findByIdAndUpdate(
      req.body.postId
    ).populate("author", "_id");
    if (!postFound) {
      return res.status(400).json({ error: "Post doesn't exist" });
    }
    // check if already liked
    const numberOfLikesByUser = postFound.likes.filter(
      (likeUserId) => likeUserId.toString() === req.user._id.toString()
    ).length;

    if (numberOfLikesByUser > 0) {
      return res.status(400).json({
        message:
          "User has already liked the post c]'\
        ",
      });
    }
    postFound.likes.push(req.user._id);
    await postFound.save();

    return res.status(200).json({ message: "Post liked", post: postFound });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.put("/unlike", protectedRoute, async (req, res) => {
  try {
    const postFound = await PostModel.findByIdAndUpdate(
      req.body.postId
    ).populate("author", "_id");
    if (!postFound) {
      return res.status(400).json({ error: "Post doesn't exist" });
    }
    // Check if the user has already liked the post
    const isLiked = postFound.likes.includes(req.user._id);

    if (!isLiked) {
      return res.status(400).json({ message: "Post not liked by the user" });
    }

    // Remove the user's ID from the likes array
    postFound.likes.pull(req.user._id);

    // Save the updated post
    const updatedPost = await postFound.save();

    res
      .status(200)
      .json({ message: "Post unliked successfully", postFound: updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
});

router.put("/comment", protectedRoute, async (req, res) => {
  const comment = {
    commentText: req.body.commentText,
    commentedBy: req.user._id,
  };
  try {
    const postFound = await PostModel.findByIdAndUpdate(
      req.body.postId
    ).populate("author", "_id");
    if (!postFound) {
      return res.status(400).json({ error: "Post doesn't exist" });
    }
    postFound.comments.push(comment);
    await postFound.save();
    return res.status(200).json({ message: "Comment added", post: postFound });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
});




module.exports = router;
