const Comment = require("../models/comment");

exports.create = async (req, res) => {
  try {
    const { content, user, product } = req.body.comment;
    const comment = await new Comment({
      content,
      user: user._id,
      product: product._id,
    }).save();

    res.json(comment);
  } catch (error) {
    console.log(error);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await Comment.find({})
        .populate("user")
        .populate("product")
        .populate({ path: "comments", populate: { path: "user" } })
        .sort([["createdAt", "desc"]])
        .exec()
    );
  } catch (error) {
    console.log(error);
  }
};

exports.updateLikes = async (req, res) => {
  try {
    const user = req.body;
    const comment = await Comment.findOne({ _id: req.params.commentId }).exec();
    let { likes, usersWhoLike, dislikes, usersWhoDislike } = comment;

    if (usersWhoLike.length !== 0 && usersWhoLike.includes(user._id)) return;

    if (usersWhoDislike.length !== 0 && usersWhoDislike.includes(user._id)) {
      usersWhoDislike = usersWhoDislike.filter((userId) => userId != user._id);
      dislikes -= 1;
    }

    usersWhoLike.push(user._id);
    likes += 1;

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      {
        likes,
        usersWhoLike,
        dislikes,
        usersWhoDislike,
      }
    ).exec();
    res.json(updatedComment);
  } catch (error) {
    res.status(400).send("Failed to update likes");
  }
};

exports.updateDislikes = async (req, res) => {
  try {
    const user = req.body;
    const comment = await Comment.findOne({ _id: req.params.commentId }).exec();
    let { likes, usersWhoLike, dislikes, usersWhoDislike } = comment;

    if (usersWhoDislike.length !== 0 && usersWhoDislike.includes(user._id))
      return;

    if (usersWhoLike.length !== 0 && usersWhoLike.includes(user._id)) {
      usersWhoLike = usersWhoLike.filter((userId) => userId !== user._id);
      likes -= 1;
    }

    usersWhoDislike.push(user._id);
    dislikes += 1;

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      {
        likes,
        usersWhoLike,
        dislikes,
        usersWhoDislike,
      }
    ).exec();
    res.json(updatedComment);
  } catch (error) {
    res.status(400).send("Failed to update likes");
  }
};

exports.addSubComment = async (req, res) => {
  try {
    const { content, user, product } = req.body;
    const subComment = await new Comment({
      content,
      user: user._id,
      product: product._id,
      isSubComment: true,
    }).save();

    console.log(subComment);

    const comment = await Comment.findOne({ _id: req.params.commentId }).exec();
    comment.comments.push(subComment._id);
    console.log(comment);
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { comments: comment.comments }
    ).exec();
    res.json(subComment);
  } catch (error) {
    res.status(400).send("Failed to add sub-comment");
  }
};
