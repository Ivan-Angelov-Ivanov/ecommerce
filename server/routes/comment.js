const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

// import
const {
  create,
  list,
  updateLikes,
  updateDislikes,
  addSubComment,
} = require("../controllers/comment");
// routes

router.post("/comment", authCheck, create);
router.post("/comment/likes/:commentId", authCheck, updateLikes);
router.post("/comment/dislikes/:commentId", authCheck, updateDislikes);
router.post("/comment/sub-comments/:commentId", authCheck, addSubComment);
router.get("/comments", list);

module.exports = router;
