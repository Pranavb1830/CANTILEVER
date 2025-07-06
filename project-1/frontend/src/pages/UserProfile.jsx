import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import "../styles/userprofile.css";
import { getImageUrl } from "../utils/getImageUrl"; 

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/auth/user/${id}`);
        setProfile({
          username: response.data.username,
          email: response.data.email,
          profilePhoto: response.data.profilePhoto,
        });
        setPosts(response.data.posts || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [id]);

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete post");
    }
  };

  const isOwner = user?.userId === id;

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="user-posts-container">
      <h2>{profile.username}'s Profile</h2>

      <img
        src={getImageUrl(profile.profilePhoto)}
        alt="Profile"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "1rem",
          cursor: "pointer",
          border: "2px solid #333",
        }}
      />

      <p>
        <strong>Email:</strong>{" "}
        {profile.email ? profile.email : "🔒 [Hidden]"}
      </p>

      {isOwner && (
        <button onClick={() => navigate('/change-password')}>
          Change Password
        </button>
      )}

      <p><strong>Number of posts:</strong> {posts?.length || 0}</p>

      <h3>Posts</h3>
      {posts.length === 0 && <p>No posts found for this user.</p>}

      <ul>
        {posts.map((post) => {
          const isAuthor = user?.userId === post.author?._id;
          return (
            <li key={post._id} className="user-post-item">
              <Link to={`/posts/${post._id}`} className="link">
                {post.title}
              </Link>
              {isAuthor && (
                <span className="user-post-actions">
                  <Link to={`/edit/${post._id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserProfile;