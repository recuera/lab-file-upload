const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/Post");
const passport   = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');


router.get("/posts/new", ensureLoggedIn('/login'), (req, res) => {
  const userId = req.user._id;
  res.render("posts/new", {userId});
});

router.post("/posts/new/:id", ensureLoggedIn('/login'), (req, res) => {
  const userId = req.params.id;
  const content = req.body.content;
  if (content == "") {
    res.render("posts/new", { userId,
      errorMessage: "The post can't be empty"
    });
    return;
  }
  User.findById(userId).exec().then((err, user) => {
    let newPost = Post({
      content,
      creatorId: {userId}
    });
    newPost.save(err => {
      res.redirect("/");
    });
  }).catch(e => next(e));
})

router.get("/posts/show/:postId", (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).exec().then( post => {
    res.render("posts/show", {post});
  }).catch(e => next(e))
});


module.exports = router;