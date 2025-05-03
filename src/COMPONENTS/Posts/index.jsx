import { useEffect, useState } from "react";
import "./PostsComponent.css"; // Importing custom CSS file
import PostComponent from "./post";
import { PostForm } from "./form";
import { getAllPosts } from "../../services/postService";

export default function PostsComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [posts, setPosts] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New state for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [likeFilter, setLikeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [creators, setCreators] = useState([]);

  const userRole = localStorage.getItem("userRole");

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const notification = () => {
    toggleForm();
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
      
      // Extract unique creators for the filter dropdown
      const uniqueCreators = Array.from(
        new Set(data.map(post => post.creator?.name).filter(Boolean))
      );
      setCreators(uniqueCreators);
      
    } catch (err) {
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Apply filters and search whenever filter states change
  useEffect(() => {
    if (!posts) return;
    
    let result = [...posts];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title?.toLowerCase().includes(lowerCaseSearch) || 
        post.text?.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      result = result.filter(post => {
        const postDate = new Date(post.createdAt);
        switch (dateFilter) {
          case "today":
            return postDate >= today;
          case "yesterday":
            return postDate >= yesterday && postDate < today;
          case "week":
            return postDate >= lastWeek;
          case "month":
            return postDate >= lastMonth;
          default:
            return true;
        }
      });
    }
    
    // Apply like filter
    if (likeFilter !== "all") {
      result = result.filter(post => {
        const likesCount = post.reviews?.likes?.length || 0;
        switch (likeFilter) {
          case "popular":
            return likesCount > 10;
          case "trending":
            return likesCount > 5;
          case "new":
            return likesCount <= 5;
          default:
            return true;
        }
      });
    }
    
    // Apply creator filter
    if (selectedCreator !== "all") {
      result = result.filter(post => 
        post.creator?.name === selectedCreator
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "mostLiked":
          return (b.reviews?.likes?.length || 0) - (a.reviews?.likes?.length || 0);
        case "mostCommented":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    setFilteredPosts(result);
  }, [posts, searchTerm, dateFilter, sortOption, likeFilter, selectedCreator]);

  const refreshData = async () => {
    await fetchPosts();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setSortOption("newest");
    setLikeFilter("all");
    setSelectedCreator("all");
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <div className="btns">
          {userRole && (
            <button className="add-post-btn" onClick={toggleForm}>
              Add Post
            </button>
          )}
          <button 
            className="filter-toggle-btn" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"} 
            <i className={`fa-solid fa-filter ${showFilters ? "active" : ""}`}></i>
          </button>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label>Date:</label>
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostCommented">Most Commented</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Popularity:</label>
            <select 
              value={likeFilter} 
              onChange={(e) => setLikeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Posts</option>
              <option value="popular">Popular (10+ likes)</option>
              <option value="trending">Trending (5+ likes)</option>
              <option value="new">New (≤5 likes)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Creator:</label>
            <select 
              value={selectedCreator} 
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Creators</option>
              {creators.map((creator, index) => (
                <option key={index} value={creator}>{creator}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="reset-filters-btn" 
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {isFormOpen && <PostForm notifyParent={notification} />}
      
      {filteredPosts && filteredPosts.length > 0 && (
        <div className="results-info">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          {searchTerm && <span> matching "{searchTerm}"</span>}
        </div>
      )}
      
      <div className="posts-list">
        {loading ? (
          <div className="loading-spinner">Loading posts...</div>
        ) : (
          <>
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostComponent
                  key={post._id}
                  post={post}
                  notifyParent={refreshData}
                />
              ))
            ) : (
              <div className="no-posts-message">
                <i className="fa-solid fa-box-open"></i>
                <p>No posts found. Try adjusting your filters or add a new post.</p>
              </div>
            )}
          </>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}