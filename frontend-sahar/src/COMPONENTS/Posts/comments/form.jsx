import React, { useState } from "react";
import "./form.css";
import loginImage from "../../../pages/user-profile-icon-symbol-template-free-vector.jpg";

export default function CommentForm({ onCommentSubmit }) {
  const [comment, setComment] = useState("");
  const user = {
    name: localStorage.getItem("loggedInUser"),
    image: localStorage.getItem("image"),
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // Envoyer le commentaire au parent
    onCommentSubmit(comment);

    // Réinitialiser le champ
    setComment("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-header">
        <img
          className="comment-avatar"
          src={
            user?.image
              ? user.image.startsWith("https://")
                ? user.image // External URL
                : user.image.startsWith("data:image")
                ? user.image // Base64 Image
                : `http://localhost:5001/uploads/${user.image}` // Local file
              : loginImage // Default image
          }
          alt={user.name}
        />
        <label>{user.name}</label>
      </div>
      <textarea
        className="comment-input"
        placeholder="Écrire un commentaire..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="comment-button">
        Envoyer
      </button>
    </form>
  );
}
