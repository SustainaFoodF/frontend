import CommentForm from "./form";
import "./index.css"; // Import the CSS file here
import CommentTable from "./table";

export default function Comments({ data, onCommentSubmit, postId }) {
  const isLoggedUser =
    localStorage.getItem("token") !== undefined &&
    localStorage.getItem("token") !== null;
  return (
    <div className="comments-area">
      {isLoggedUser && <CommentForm onCommentSubmit={onCommentSubmit} />}
      <CommentTable comments={data} postId={postId} />
    </div>
  );
}
