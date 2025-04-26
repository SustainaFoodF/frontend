import { useState } from "react";
import { createPost, updatePost } from "../../services/postService";
import "./form.css"; // Import the CSS file here
import { deleteFile, uploadFile } from "../../services/helpers";

export function PostForm(props) {
  const { notifyParent, post, setMode } = props;
  console.log(post);
  const action = post != null ? "edit" : "add";
  // State to manage form data
  const [postData, setPostData] = useState({
    title: post ? post.title : "",
    text: post ? post.text : "",
    files: post ? post.files : [],
  });
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = await uploadFile(file);
      setPostData((prevState) => ({
        ...prevState,
        files: [...prevState.files, fileName],
      }));
      e.target.value = ""; // Reset the input value
    } catch (error) {
      setErrorMessage("File upload failed!");
    }
  };
  // State to manage form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if the form is already submitting
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(""); // Reset error message on new submission

    try {
      // Replace this URL with your actual API endpoint for creating posts
      if (action === "add") {
        await createPost(postData);
        notifyParent();
      } else {
        await updatePost(post._id, postData);
        setMode("view");
        notifyParent();
      }
      // Notify the parent component (e.g., update the list of posts)

      // Clear form data after successful submission
      setPostData({
        title: "",
        text: "",
        files: [],
      });
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
    }
  };
  const handleFileDelete = async (fileName) => {
    try {
      // Assuming deleteFile is a function that handles file deletion from the server
      await deleteFile(fileName);

      // Remove file from the state
      setPostData((prevState) => ({
        ...prevState,
        files: prevState.files.filter((file) => file !== fileName),
      }));
    } catch (error) {
      setErrorMessage("File deletion failed!");
    }
  };
  return (
    <div className="post-form">
      {action === "add" ? <h3>Create a New Post</h3> : <h3>Edit your post</h3>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Content</label>
          <textarea
            id="text"
            name="text"
            value={postData.text}
            onChange={handleInputChange}
            required
            placeholder="Enter post content"
          />
        </div>
        <div className="form-group">
          <label>Upload File</label>
          <input
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
        </div>

        {/* File Previews */}
        <div className="file-preview">
          {postData.files.map((file, index) => {
            const fileUrl = `http://localhost:5001/uploads/${file}`;
            const fileExt = file.split(".").pop();

            const deleteFileHandler = () => handleFileDelete(file);

            return (
              <div key={index} className="file-item">
                {/* Display file preview */}
                {["jpg", "jpeg", "png", "gif"].includes(fileExt) && (
                  <img key={index} src={fileUrl} alt="Uploaded" width="100" />
                )}
                {fileExt === "pdf" && (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 View PDF
                  </a>
                )}
                {["doc", "docx"].includes(fileExt) && (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📝 View Document
                  </a>
                )}
                {["mp4", "avi", "mov"].includes(fileExt) && (
                  <video key={index} width="100" controls src={fileUrl}></video>
                )}
                {![
                  "jpg",
                  "jpeg",
                  "png",
                  "gif",
                  "pdf",
                  "doc",
                  "docx",
                  "mp4",
                  "avi",
                  "mov",
                ].includes(fileExt) && <p key={index}>📁 {file}</p>}

                {/* Delete button */}
                <span onClick={deleteFileHandler} className="delete-btn-x">
                  ❌
                </span>
              </div>
            );
          })}
        </div>
        <div className="buttons-zone">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-posts"
          >
            {isSubmitting
              ? "Submitting..."
              : action === "add"
              ? "Create Post"
              : "Update Post"}
          </button>
          {action === "edit" && (
            <button
              type="button"
              className="cancel-update"
              onClick={() => setMode("view")}
            >
              {" "}
              Cancel update
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
