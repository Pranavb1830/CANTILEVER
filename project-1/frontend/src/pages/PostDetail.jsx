import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/postdetail.css";
import { getImageUrl } from "../utils/getImageUrl";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`);
        setPost({
          ...response.data.post,
          comments: response.data.comments || []
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await API.post(`/posts/${id}/like`);
      setPost({
        ...post,
        likes: response.data.post.likes,
        dislikes: response.data.post.dislikes,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like post");
    }
  };

  const handleDislike = async () => {
    try {
      const response = await API.post(`/posts/${id}/dislike`);
      setPost({
        ...post,
        likes: response.data.post.likes,
        dislikes: response.data.post.dislikes,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dislike post");
    }
  };


  const handleComment = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await API.post(`/posts/${id}/comments`, { content: comment });
      const newComment = response.data;
      setPost({ ...post, comments: [...(post.comments || []), newComment] });
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleCommentLike = async (commentId) => {
    const response = await API.post(`/posts/comments/${commentId}/like`);
    updateCommentInState(response.data);
  };

  const handleCommentDislike = async (commentId) => {
    const response = await API.post(`/posts/comments/${commentId}/dislike`);
    updateCommentInState(response.data);
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    const response = await API.post(`/posts/comments/${parentId}/replies`, { content: replyContent });
    setPost({ ...post, comments: [...post.comments, response.data] });
    setReplyTo(null);
    setReplyContent("");
  };

  const updateCommentInState = (updated) => {
    setPost({
      ...post,
      comments: post.comments.map(c => c._id === updated._id ? updated : c)
    });
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="post-detail-container">
      <div className="post-detail">
        <h2>{post.title}</h2>
        <p><strong>Content:</strong> {post.content}</p>
        <p>
        <strong>Author:</strong>{" "}
        <Link to={`/user/${post.author?._id}`} className="author-link">
          {post.author?.username}
        </Link>
        </p>
        <p><strong>Likes:</strong> {post.likes?.length}</p>
        {post.image && (
        <img
          src={getImageUrl(post.image)}
          alt="Post"
          style={{ maxWidth: '100%', margin: '1rem 0' }}
        />
        )}
        <div className="like-dislike-buttons">
          <button className="emoji-button like-button" onClick={handleLike}>👍</button>
          <button className="emoji-button dislike-button" onClick={handleDislike}>👎</button>
        </div>

        {user && user.userId === post.author?._id && (
          <div className="edit-delete-buttons">
            <Link to={`/edit/${id}`}><button>Edit</button></Link>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}

        <p><strong>Comments:</strong> {(post.comments || []).length}</p>
        {(post.comments || []).filter(c => !c.parent).map((c) => (
          <div key={c._id} className="comment">
            <strong>{c.author?.username || 'Anonymous'}</strong>
            <p>{c.content}</p>

            <div className="comment-actions">
              <button onClick={() => handleCommentLike(c._id)}>👍 {c.likes?.length || 0}</button>
              <button onClick={() => handleCommentDislike(c._id)}>👎 {c.dislikes?.length || 0}</button>
              <button onClick={() => setReplyTo(c._id)}>Reply</button>
            </div>

            <div className="replies">
              {(post.comments || []).filter(r => r.parent === c._id).map((r) => (
                <div key={r._id} className="reply">
                  <strong>{r.author?.username || 'Anonymous'}</strong>
                  <p>{r.content}</p>
                  <div className="comment-actions">
                    <button onClick={() => handleCommentLike(r._id)}>👍 {r.likes?.length || 0}</button>
                    <button onClick={() => handleCommentDislike(r._id)}>👎 {r.dislikes?.length || 0}</button>
                  </div>
                </div>
              ))}
            </div>

            {replyTo === c._id && (
              <form onSubmit={(e) => handleReply(e, c._id)} className="reply-form">
                <textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  required
                />
                <button type="submit">Reply</button>
              </form>
            )}
          </div>
        ))}


        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="comment-submit">Comment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetail;