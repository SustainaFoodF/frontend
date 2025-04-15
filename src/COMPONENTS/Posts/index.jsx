import { useEffect, useState } from "react";
import "./PostsComponent.css"; // Importing custom CSS file
import PostComponent from "./post";
import { PostForm } from "./form";
import { getAllPosts } from "../../services/postService";

export default function PostsComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false); // To toggle the form visibility
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen); // Toggle the form visibility
  };
  const userRole = localStorage.getItem("userRole");
  const [posts, setPosts] = useState(null); // State to hold posts data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const notification = () => {
    toggleForm();
    fetchPosts();
  };
  const fetchPosts = async () => {
    try {
      const data = await getAllPosts(); // Assuming getAllPosts is an async function
      setPosts(data); // Store posts in state
    } catch (err) {
      setError("Error fetching posts");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    fetchPosts(); // Call the fetch function
  }, []);
  const refreshData = async () => {
    await fetchPosts();
  };
  return (
    <div className="posts-container">
      {/* Button to open form */}
      <div className="btns">
        {userRole && (
          <button className="add-post-btn" onClick={toggleForm}>
            Add Post
          </button>
        )}
      </div>
      {isFormOpen && <PostForm notifyParent={notification} />}
      <div className="posts-list">
        {loading ? (
          <>... loading</>
        ) : (
          <>
            {posts &&
              posts.map((post) => (
                <PostComponent
                  key={post._id}
                  post={post}
                  notifyParent={refreshData}
                />
              ))}
          </>
        )}
        {error && error}
      </div>
    </div>
  );
}
