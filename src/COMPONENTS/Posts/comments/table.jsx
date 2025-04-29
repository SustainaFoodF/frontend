import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./table.css"; // Importation du fichier CSS
import loginImage from "../../../pages/user-profile-icon-symbol-template-free-vector.jpg";

export default function CommentTable({ comments = [] }) {
  console.log(comments);
  return (
    <div className="comment-container">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          {/* Avatar du propriétaire */}
          <img
            className="comment-avatar"
            src={
              comment.owner.image
                ? comment.owner.image.startsWith("https://")
                  ? comment.owner.image // External URL
                  : comment.owner.image.startsWith("data:image")
                  ? comment.owner.image // Base64 Image
                  : `http://localhost:5001/uploads/${comment.owner.image}` // Local file
                : loginImage // Default image
            }
            alt={comment.owner?.name}
          />

          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-author">{comment.owner?.name}</span>
              <span className="comment-time">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
            {/* Texte du commentaire */}
            <p className="comment-text">{comment.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
