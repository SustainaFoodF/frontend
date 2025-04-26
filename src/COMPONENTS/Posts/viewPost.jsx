import { useState, useEffect } from "react";
import { addReview, deleteReview } from "../../services/postService";
import Comments from "./comments";
import { createComment } from "../../services/commentService";
import { analyzeCommentsWithGemini } from "./helper";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [commentFilter, setCommentFilter] = useState("newest");
  const [filteredComments, setFilteredComments] = useState([]);
  const [openAnalyze, setOpenAnalyze] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [aiReviewSummary, setAiReviewSummary] = useState(null);

  const loggedInUserId = localStorage.getItem("loggedInUserId");

  const isUserLikedPost = post.reviews
    ? post?.reviews?.likes.find((e) => e === loggedInUserId) != null
    : false;
  const isUserDislikedPost = post.reviews
    ? post?.reviews?.dislikes.find((e) => e === loggedInUserId) != null
    : false;

  // Filter and sort comments based on search term and filter selection
  useEffect(() => {
    if (!post?.comments) {
      setFilteredComments([]);
      return;
    }

    let filtered = [...post.comments];

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (comment) =>
          comment.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (comment.creator?.name &&
            comment.creator.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (commentFilter) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "popularity":
        // Assuming comments might have likes or similar metrics
        // If not, this would behave similar to newest
        filtered.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredComments(filtered);
  }, [post?.comments, searchTerm, commentFilter]);

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

  // Format date for better readability
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  async function startAnalyze() {
    setOpenAnalyze(true);
    setLoadingAnalyze(true);
    const summary = await analyzeCommentsWithGemini(filteredComments);
    console.log(summary);
    setAiReviewSummary(summary);
    setLoadingAnalyze(false);
  }
  return (
    <div className="post-container">
      <div className="post-header">
        <p className="post-creator">Created by: {post.creator?.name}</p>{" "}
        <p className="post-time">Posted on {formatDate(postDate)}</p>
        {isOwner && (
          <div className="post-actions">
            <button className="update-btn" onClick={() => setMode("edit")}>
              update
            </button>
            <button className="update-btn" onClick={() => startAnalyze()}>
              Analyze{" "}
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              delete
            </button>
          </div>
        )}
      </div>
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
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
              <i className="fa-solid fa-thumbs-up"></i>{" "}
              {post?.reviews?.likes?.length}
            </button>
            <button className="like-btn">
              <i
                className="fa-solid fa-thumbs-down"
                onClick={() => handleAddReview("dislike")}
                disabled={isLoading}
              ></i>{" "}
              {post?.reviews?.dislikes?.length}
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
                  <i className="fa-solid fa-thumbs-up"></i>{" "}
                  {post?.reviews?.likes?.length}
                </button>
                <button
                  className="like-btn like-btn-selected"
                  disabled={isLoading}
                  onClick={() => handleDeleteReview("dislike")}
                >
                  <i className="fa-solid fa-thumbs-down"></i>{" "}
                  {post?.reviews?.dislikes?.length}
                </button>
              </>
            ) : (
              <>
                <button
                  className="like-btn like-btn-selected"
                  disabled={isLoading}
                  onClick={() => handleDeleteReview("like")}
                >
                  <i className="fa-solid fa-thumbs-up"></i>{" "}
                  {post?.reviews?.likes?.length}
                </button>
                <button
                  className="like-btn"
                  onClick={() => handleAddReview("dislike")}
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-thumbs-down"></i>{" "}
                  {post?.reviews?.dislikes?.length}
                </button>
              </>
            )}
          </>
        )}

        <button
          className="comment-btn"
          onClick={() => setOpenComment(!openComment)}
        >
          <i className="fa-solid fa-comment"></i> {post?.comments?.length || 0}
        </button>
      </div>
      {openAnalyze && (
        <>
          {loadingAnalyze ? (
            <>Loading in progress ... </>
          ) : (
            <>
              {aiReviewSummary && (
                <div className="ai-review-summary">
                  <h4>🔎 AI Review Summary</h4>
                  <p>👍 Positive Comments: {aiReviewSummary.positiveCount}</p>
                  <p>👎 Negative Comments: {aiReviewSummary.negativeCount}</p>
                  <p>🟢 Positive Summary: {aiReviewSummary.positiveSummary}</p>
                  <p>🔴 Negative Summary: {aiReviewSummary.negativeSummary}</p>
                  <p>
                    🧠 Overall Sentiment: {aiReviewSummary.overallSentiment}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
      {openComment && (
        <>
          <div className="comment-controls">
            <div className="search-container">
              <input
                type="text"
                className="comment-search"
                placeholder="Search in comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fa-solid fa-search search-icon"></i>
            </div>
            <div className="filter-container">
              <label htmlFor="comment-filter">Sort by: </label>
              <select
                id="comment-filter"
                className="comment-filter"
                value={commentFilter}
                onChange={(e) => setCommentFilter(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
          {searchTerm && (
            <div className="search-results">
              Found {filteredComments.length} comment(s) matching "{searchTerm}"
            </div>
          )}
          <Comments
            data={filteredComments}
            onCommentSubmit={handleSubmitComment}
          />
        </>
      )}
    </div>
  );
}
