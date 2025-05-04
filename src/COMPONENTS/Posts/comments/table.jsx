import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./table.css";
import loginImage from "../../../pages/user-profile-icon-symbol-template-free-vector.jpg";
import {
  updateComment,
  deleteComment,
  saveResponse,
} from "../../../services/commentService"; // Import propre !
import axios from "axios";

export default function CommentTable({ comments = [], postId }) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replies, setReplies] = useState(() => {
    const map = {};
    comments.forEach((comment) => {
      const commentId = comment._id;
      const responseList = comment.responses || [];

      map[commentId] = responseList.map((r) => ({
        text: r.value,
        author: comment.owner?.name || "Anonyme",
      }));
    });
    return map;
  });
  const [replyText, setReplyText] = useState({});
  const [reactions, setReactions] = useState({});

  const loggedUser = localStorage.getItem("loggedInUser");

  const handleEdit = (id, value) => {
    setEditingCommentId(id);
    setEditText(value);
  };

  const saveEdit = async (id) => {
    try {
      await updateComment(postId, id, editText);
      setEditingCommentId(null);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      try {
        await deleteComment(postId, id);
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire", error);
      }
    }
  };

  const handleReply = async (id, postId) => {
    console.log(id, postId);

    if (!replyText[id]?.trim()) return;
    await saveResponse(postId, id, replyText[id]);
    const newReplies = { ...replies };
    if (!newReplies[id]) newReplies[id] = [];
    newReplies[id].push({ text: replyText[id], author: loggedUser });
    setReplies(newReplies);
    setReplyText({ ...replyText, [id]: "" });
  };

  const handleReaction = (id, emoji) => {
    setReactions({ ...reactions, [id]: emoji });
  };
  useEffect(() => {
    console.log(replies);
  }, [replies]);
  return (
    <div className="comment-container">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          {/* Avatar */}
          <img
            className="comment-avatar"
            src={
              comment.owner.image
                ? comment.owner.image.startsWith("https://")
                  ? comment.owner.image
                  : comment.owner.image.startsWith("data:image")
                  ? comment.owner.image
                  : `http://localhost:5001/uploads/${comment.owner.image}`
                : loginImage
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

            {/* Texte ou Champ de modification */}
            {editingCommentId === comment._id ? (
              <>
                <textarea
                  className="comment-edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="comment-btn-save"
                  onClick={() => saveEdit(comment._id)}
                >
                  Sauvegarder
                </button>
              </>
            ) : (
              <p className="comment-text">{comment.value}</p>
            )}

            {/* Actions */}
            <div className="comment-actions">
              <span
                className="action"
                onClick={() => handleReaction(comment._id, "❤️")}
              >
                ❤️
              </span>
              <span
                className="action"
                onClick={() => handleReaction(comment._id, "😂")}
              >
                😂
              </span>
              <span
                className="action"
                onClick={() => handleReaction(comment._id, "👍")}
              >
                👍
              </span>
              <span
                className="action"
                onClick={() => handleReaction(comment._id, "😢")}
              >
                😢
              </span>
              <span className="dot">•</span>
              <span
                className="action"
                onClick={() =>
                  setReplyText({ ...replyText, [comment._id]: "" })
                }
              >
                Répondre
              </span>

              {comment.owner?.name === loggedUser && (
                <>
                  <span className="dot">•</span>
                  <span
                    className="action"
                    onClick={() => handleEdit(comment._id, comment.value)}
                  >
                    Modifier
                  </span>
                  <span className="dot">•</span>
                  <span
                    className="action"
                    onClick={() => handleDelete(comment._id)}
                  >
                    Supprimer
                  </span>
                </>
              )}
            </div>

            {/* Réaction affichée */}
            {reactions[comment._id] && (
              <div className="comment-reaction">{reactions[comment._id]}</div>
            )}

            {/* Champ de réponse */}
            {replyText[comment._id] !== undefined && (
              <div>
                <textarea
                  className="comment-reply-input"
                  placeholder="Votre réponse..."
                  value={replyText[comment._id]}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [comment._id]: e.target.value,
                    })
                  }
                />
                <button
                  className="comment-btn-send"
                  onClick={() => handleReply(comment._id, postId)}
                >
                  Répondre
                </button>
              </div>
            )}

            {/* Liste des réponses */}
            {replies[comment._id] && (
              <div className="comment-replies">
                {replies[comment._id].map((reply, idx) => (
                  <div key={idx} className="comment-reply">
                    <strong>{reply.author}:</strong> {reply.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
