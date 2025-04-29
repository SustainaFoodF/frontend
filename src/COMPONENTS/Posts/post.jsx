import React, { useState } from "react";
import "./PostComponent.css"; // Import the CSS file for styling
import { deletePost } from "../../services/postService";
import ViewPost from "./viewPost";
import { PostForm } from "./form";

export default function PostComponent({ post, notifyParent }) {
  //const loggedInUserId = localStorage.getItem("loggedInUserId");
  //const isOwner = post.creator._id === loggedInUserId;
  const postDate = new Date(post.createdAt) // Formatting the createdAt date
  const getFileUrl = (fileName) => `http://localhost:5001/uploads/${fileName}`;
  const renderFilePreview = (fileName) => {
    const fileExt = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
      return <img src={getFileUrl(fileName)} alt="Uploaded" width="100" />;
    } else if (fileExt === "pdf") {
      return (
        <a
          href={getFileUrl(fileName)}
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 View PDF
        </a>
      );
    } else if (["doc", "docx"].includes(fileExt)) {
      return (
        <a
          href={getFileUrl(fileName)}
          target="_blank"
          rel="noopener noreferrer"
        >
          📝 View Document
        </a>
      );
    } else if (["mp4", "avi", "mov"].includes(fileExt)) {
      return <video width="100" controls src={getFileUrl(fileName)}></video>;
    } else {
      return <p>📁 {fileName}</p>;
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      await deletePost(post._id); // Call the delete function passed as a prop
      await notifyParent();
    }
  };
  const [mode, setMode] = useState("view");
  if (mode === "view")
    return (
      <ViewPost
        handleDelete={handleDelete}
       // isOwner={isOwner}
        post={post}
        postDate={postDate}
        renderFilePreview={renderFilePreview}
        setMode={setMode}
        notifyParent={notifyParent}
      />
    );
  else {
    return (
      <PostForm notifyParent={notifyParent} post={post} setMode={setMode} />
    );
  }
}
