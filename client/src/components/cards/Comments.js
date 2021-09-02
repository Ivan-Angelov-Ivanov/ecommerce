import React, { useEffect, useState, createElement } from "react";
import { Comment, Avatar, Form, Button, Input, Tooltip } from "antd";
import {
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
} from "@ant-design/icons";
import {
  getComments,
  createComment,
  updateCommentLikes,
  updateCommentDislikes,
  createSubComment,
} from "../../functions/comment";
import { toast } from "react-toastify";
import Moment from "react-moment";
import defaulAvatar from "../../images/default-profile-image.jpg";

const { TextArea } = Input;

const Comments = ({ user, product }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [commentId, setCommentId] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => {
    getComments().then((res) => {
      setComments(res.data);
      console.log(res.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment({ content, user, product }, user.token)
      .then((res) => {
        setContent("");
        loadComments();
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.status === 400) toast.error(error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const handleLikes = (comment) => {
    updateCommentLikes(comment, user, user.token).then((res) => {
      loadComments();
    });
  };

  const handleDislikes = (comment) => {
    updateCommentDislikes(comment, user, user.token).then((res) => {
      loadComments();
    });
  };

  const handleSubComments = () => {
    createSubComment(commentId, { content, product, user }, user.token).then(
      (res) => {
        loadComments();
      }
    );
  };

  const addSubComment = () => (
    <>
      <Form.Item>
        <TextArea
          rows={2}
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" onClick={handleSubComments}>
          Add Comment
        </Button>
      </Form.Item>
    </>
  );

  const showComments = (comments, areSubComments) =>
    comments
      .filter((comment) => {
        if (areSubComments) return comment.isSubComment;
        else return !comment.isSubComment;
      })
      .map((comment) => (
        <>
          <Comment
            actions={[
              <Tooltip key="comment-basic-like" title="Like">
                <span onClick={() => handleLikes(comment)}>
                  {createElement(
                    comment.usersWhoLike.includes(user._id)
                      ? LikeFilled
                      : LikeOutlined
                  )}
                  <span className="comment-action">{comment.likes}</span>
                </span>
              </Tooltip>,
              <Tooltip key="comment-basic-dislike" title="Dislike">
                <span onClick={() => handleDislikes(comment)}>
                  {createElement(
                    comment.usersWhoDislike.includes(user._id)
                      ? DislikeFilled
                      : DislikeOutlined
                  )}
                  <span className="comment-action">{comment.dislikes}</span>
                </span>
              </Tooltip>,
              <span
                key="comment-basic-reply-to"
                onClick={() => {
                  setShowTextarea(!showTextarea);
                  setCommentId(comment._id);
                }}
              >
                Reply to
              </span>,
            ]}
            author={comment.user.name}
            avatar={
              <Avatar
                src={
                  comment.user.avatar != null
                    ? comment.user.avatar
                    : defaulAvatar
                }
                alt={comment.user.name}
              />
            }
            content={<p className="p-2">{comment.content}</p>}
            datetime={
              <Tooltip>
                <Moment date={comment.createdAt} format="YYYY-MM-DD HH:mm:ss" />
              </Tooltip>
            }
          >
            {showTextarea && commentId === comment._id ? addSubComment() : ""}
            {showComments(comment.comments, true)}
          </Comment>
          <hr />
        </>
      ));

  return (
    <div className="container">
      <div>
        <>
          <Form.Item>
            <TextArea
              rows={4}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" onClick={handleSubmit}>
              Add Comment
            </Button>
          </Form.Item>
        </>
      </div>
      <div className="p-3">
        {comments.length ? (
          showComments(comments, false)
        ) : (
          <div className="text-center col p-5">No comments yet</div>
        )}
      </div>
    </div>
  );
};

export default Comments;
