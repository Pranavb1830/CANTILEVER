import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/createEdit.css";
import API from "../api/api";

const DEFAULT_GENRES = ["General", "Sports", "Life", "Music", "Technology", "Travel", "Food"];

const CreatePost = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    genres: [],
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [availableGenres, setAvailableGenres] = useState(DEFAULT_GENRES);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await API.get("/posts");
        const unique = new Set(DEFAULT_GENRES);
        res.data.forEach(post => {
          post.genres?.forEach(g => unique.add(g));
        });
        setAvailableGenres(Array.from(unique));
      } catch (err) {
        console.error("Could not load genres, using defaults:", err);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenreChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setForm({ ...form, genres: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const selectedGenres = form.genres.length > 0 ? form.genres : ["General"];

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("genres", JSON.stringify(selectedGenres));
    if (image) formData.append("image", image);

    try {
      const response = await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setForm({ title: "", content: "", genres: [] });
        setImage(null);
        navigate(`/posts/${response.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Genres:</label><br />
          <select multiple value={form.genres} onChange={handleGenreChange}>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <p style={{ fontSize: "12px" }}>
            Hold Ctrl (Windows) or Command (Mac) to select multiple
          </p>
        </div>
        <div>
          <label>Image:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;