import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/createEdit.css'; 
import API from "../api/api";

const EditPost = () => {
    const[form, setForm] = useState({
        title: "",
        content: "",
    });
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
  const fetchPost = async () => {
    try {
      const response = await API.get(`/posts/${id}`);
      setForm({
        title: response.data.title || "", 
        content: response.data.content || "" 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch post");
    }
  };
  fetchPost();
}, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.put(`/posts/${id}`, form);
            if (response.status === 200) {
                navigate(`/posts/${id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update post");
        }
    };

    return (
        <div className="edit-post">
            <h2>Edit Post</h2>
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
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditPost;