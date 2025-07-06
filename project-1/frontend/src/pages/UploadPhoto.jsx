import { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadPhoto = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    setError('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  const token = localStorage.getItem('token');

  try {
    const response = await API.post('/auth/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('UploadPhoto.jsx → Response:', response.data);

    updateUser({ ...user, profilePhoto: response.data.profilePhoto });

    navigate('/');
  } catch (err) {
    console.error('UploadPhoto.jsx → Upload failed:', err);
    setError(err.response?.data?.error || 'Upload failed');
  }
};

  return (
    <div className="auth-container">
      <h2>Upload Profile Photo</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleChange} required /><br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPhoto;