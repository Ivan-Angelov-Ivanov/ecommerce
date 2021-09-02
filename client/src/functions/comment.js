import axios from "axios";

export const getComments = async () =>
  await axios.get(`${process.env.REACT_APP_API}/comments`);

export const createComment = async (comment, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/comment`,
    { comment },
    {
      headers: {
        authtoken,
      },
    }
  );

export const updateCommentLikes = async (comment, user, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/comment/likes/${comment._id}`,
    user,
    {
      headers: {
        authtoken,
      },
    }
  );

export const updateCommentDislikes = async (comment, user, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/comment/dislikes/${comment._id}`,
    user,
    {
      headers: {
        authtoken,
      },
    }
  );

export const createSubComment = async (commentId, subComment, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/comment/sub-comments/${commentId}`,
    subComment,
    {
      headers: {
        authtoken,
      },
    }
  );
