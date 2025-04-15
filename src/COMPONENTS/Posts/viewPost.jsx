import { useState } from "react";
import { addReview, deleteReview } from "../../services/postService";
import Comments from "./comments";
import { createComment } from "../../services/commentService";

export default function ViewPost({
  isOwner,
  post,
  postDate,
  handleDelete,
  renderFilePreview,
  setMode,
  notifyParent,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [openComment, setOpenComment] = useState(false);

  const loggedInUserId = localStorage.getItem("loggedInUserId");

  const isUserLikedPost = post.reviews
    ? post?.reviews?.likes.find((e) => e === loggedInUserId) != null
    : false;
  const isUserDislikedPost = post.reviews
    ? post?.reviews?.dislikes.find((e) => e === loggedInUserId) != null
    : false;
  const handleAddReview = async (type) => {
    const isLoggedUser =
      localStorage.getItem("token") !== undefined &&
      localStorage.getItem("token") !== null;
    if (isLoggedUser) {
      setIsLoading(true);
      await addReview(post._id, type);
      notifyParent();
      setIsLoading(false);
    }
  };
  const handleDeleteReview = async (type) => {
    setIsLoading(true);
    await deleteReview(post._id, type);
    notifyParent();
    setIsLoading(false);
  };
  const handleSubmitComment = async (value) => {
    await createComment({
      postId: post._id,
      value,
    });
    notifyParent();
  };
  return (
    <div className="post-container">
      <div className="post-header">
        <p className="post-creator">Created by: {post.creator?.name}</p>{" "}
        <p className="post-time">Posted on {postDate}</p>
        {isOwner && (
          <div className="post-actions">
            <button className="update-btn" onClick={() => setMode("edit")}>
              update
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              delete
            </button>
          </div>
        )}
      </div>
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>

        {/* Displaying creator name */}
      </div>
      <div className="post-body">
        <p className="post-text">{post.text}</p>
      </div>
      {/* Displaying files if they exist */}
      {post.files && post.files.length > 0 && (
        <div className="file-preview">
          {post.files.map((file, index) => (
            <div key={index} className="file-item">
              {renderFilePreview(file)}
            </div>
          ))}
        </div>
      )}
      <div className="post-footer">
        {isUserDislikedPost === false && isUserLikedPost === false ? (
          <>
            <button
              className="like-btn"
              onClick={() => handleAddReview("like")}
              disabled={isLoading}
            >
              <i class="fa-solid fa-thumbs-up"></i>{" "}
              {post?.reviews?.likes?.length}
            </button>
            <button className="like-btn">
              <i
                class="fa-solid fa-thumbs-down"
                onClick={() => handleAddReview("dislike")}
                disabled={isLoading}
              ></i>{" "}
              {post?.reviews.dislikes.length}
            </button>
          </>
        ) : (
          <>
            {isUserDislikedPost ? (
              <>
                <button
                  className="like-btn"
                  onClick={() => handleAddReview("like")}
                  disabled={isLoading}
                >
                  <i class="fa-solid fa-thumbs-up"></i>{" "}
                  {post?.reviews?.likes?.length}
                </button>
                <button
                  className="like-btn like-btn-selected"
                  disabled={isLoading}
                  onClick={() => handleDeleteReview("dislike")}
                >
                  <i class="fa-solid fa-thumbs-down"></i>{" "}
                  {post?.reviews.dislikes.length}
                </button>
              </>
            ) : (
              <>
                <button
                  className="like-btn like-btn-selected"
                  disabled={isLoading}
                  onClick={() => handleDeleteReview("like")}
                >
                  <i class="fa-solid fa-thumbs-up"></i>{" "}
                  {post?.reviews?.likes?.length}
                </button>
                <button
                  className="like-btn"
                  onClick={() => handleAddReview("dislike")}
                  disabled={isLoading}
                >
                  <i class="fa-solid fa-thumbs-down"></i>{" "}
                  {post?.reviews.dislikes.length}
                </button>
              </>
            )}
          </>
        )}

        <button
          className="comment-btn"
          onClick={() => setOpenComment(!openComment)}
        >
          <i class="fa-solid fa-comment"></i> {post?.comments?.length || 0}
        </button>
      </div>
      {openComment && (
        <Comments
          data={
            post?.comments
              ?.slice()
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || // Sort by latest first
            []
          }
          onCommentSubmit={handleSubmitComment}
        />
      )}
    </div>
  );
}
