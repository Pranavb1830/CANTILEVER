import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">
        <Link to="/">Welcome to Blogger</Link>
      </h2>
      <div className="navbar-menu">
        {user ? (
          <>
          <div className="navbar-user-info">
            <span className="navbar-user">
              Hello, {user.username}
            </span>
            {user.profilePhoto && (
              <Link to={`/user/${user.userId}`}>
                <img 
                  src={`http://localhost:5000${user.profilePhoto}`} 
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginLeft: '10px' }}
                />
              </Link>
            )}
            </div>
            <Link to="/create" className="navbar-link">Create Post</Link>
            <Link to="/upload-photo" className="navbar-link">Upload Photo</Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;