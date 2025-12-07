import { Link, useLocation } from 'react-router-dom';
import { FaFilm, FaHome, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FaFilm className="text-blue-400" />
            <span>Movie Reviews</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 hover:text-blue-300 transition-colors ${
                isActive('/') ? 'text-blue-400' : ''
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/admin" 
              className={`flex items-center space-x-1 hover:text-blue-300 transition-colors ${
                isActive('/admin') ? 'text-blue-400' : ''
              }`}
            >
              <FaSignInAlt />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;