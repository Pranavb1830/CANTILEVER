import { useNavigate } from 'react-router-dom';
import '../styles/postcard.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div className="postcard" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <h3 className="postcard-title">{post.title}</h3>
      <p className="postcard-author">By {post.author?.username || 'Unknown'}</p>
      {post.genres && post.genres.length > 0 && (
        <p className="postcard-genres">Genres: {post.genres.join(', ')}</p>
      )}
      <p className="postcard-snippet">
        {post.content.length > 100
          ? `${post.content.slice(0, 100)}...`
          : post.content}
      </p>

      <div className="postcard-meta">
        <span>❤️ {post.likes.length} Likes</span>
        <span>👎 {post.dislikes?.length || 0} Dislikes</span>
      </div>

    </div>
  );
};

export default PostCard;