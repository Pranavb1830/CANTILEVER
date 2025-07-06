import { useEffect, useState } from "react";
import API from "../api/api";
import PostCard from "../components/PostCard";
import "../styles/home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [genres, setGenres] = useState(["General"]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get("/posts");
        setPosts(response.data);
        const uniqueGenres = new Set(["All", "General"]);
        response.data.forEach((post) => {
          if (post.genres && post.genres.length > 0) {
            post.genres.forEach((genre) => uniqueGenres.add(genre));
          }
        });
        setGenres(Array.from(uniqueGenres));
        setFilteredPosts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedGenre !== "All") {
      filtered = filtered.filter((post) =>
        post.genres?.includes(selectedGenre)
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedGenre, searchTerm]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="home-container">
      <h2>Posts</h2>

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="genre-filter">
              <label htmlFor="genre-select">Filter by Genre: </label>
              <select
                id="genre-select"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <p className="empty">No posts found.</p>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {loading && <p className="loading">Loading posts...</p>}
    </div>
  );
};

export default Home;