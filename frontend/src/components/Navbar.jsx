import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  FaFilm, 
  FaHome, 
  FaSignInAlt, 
  FaSearch, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaPlus,
  FaSignOutAlt,
  FaStar,
  FaPlay,
  FaCrown,
  FaVideo,
  FaTicketAlt,
  FaFire,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { GiFilmSpool, GiClapperboard, GiPopcorn, GiFilmStrip } from 'react-icons/gi';
import { MdLocalMovies } from 'react-icons/md';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const loggedIn = localStorage.getItem('adminLoggedIn');
    setIsAdminLoggedIn(!!loggedIn);
    
    initAnimations();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const initAnimations = () => {
    gsap.to('.floating-film', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    setIsAdminLoggedIn(false);
    navigate('/');
    
    gsap.to('.navbar-container', {
      y: -100,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        window.location.reload();
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: <FaHome />, 
      color: 'from-yellow-400 to-yellow-600' 
    }
  
  ];

  if (isAdminLoggedIn) {
    navItems.push({ 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <FaCrown />, 
      color: 'from-cyan-400 to-blue-500' 
    });
  } else {
    navItems.push({ 
      path: '/admin', 
      label: 'Admin', 
      icon: <FaSignInAlt />, 
      color: 'from-green-400 to-emerald-500' 
    });
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-film absolute text-yellow-400/10"
            style={{
              left: `${(i + 1) * 10}%`,
              top: `${Math.random() * 30}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              transform: `rotate(${Math.random() * 45 - 22.5}deg)`
            }}
          >
            <GiFilmStrip />
          </div>
        ))}
      </div>

      <nav className={`navbar-container fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl shadow-2xl shadow-yellow-400/10 py-2' 
          : 'bg-gradient-to-b from-black via-black/95 to-transparent py-4'
      }`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500" />
        
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${
          isScrolled ? 'bg-gradient-to-r from-yellow-400/20 via-red-500/20 to-purple-500/20' : 'bg-transparent'
        }`} />

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="group relative flex items-center space-x-3"
              onClick={() => {
                gsap.to('.logo-spinner', { rotation: 360, duration: 1, ease: 'power3.out' });
              }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative p-3 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 group-hover:border-yellow-400/50 transition-all duration-300">
                  <div className="logo-spinner">
                    <GiClapperboard className="text-3xl text-yellow-400" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-ping" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                  CINEMATIC
                </span>
                <span className="text-xs text-gray-400 tracking-widest">PREMIERE</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative"
                  onMouseEnter={() => {
                    gsap.to(`.nav-item-${index}`, {
                      scale: 1.1,
                      duration: 0.3,
                      ease: 'back.out(1.7)'
                    });
                  }}
                  onMouseLeave={() => {
                    gsap.to(`.nav-item-${index}`, {
                      scale: 1,
                      duration: 0.3
                    });
                  }}
                >
                  <div className={`nav-item-${index} px-6 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${item.color} text-black font-bold`
                      : 'text-gray-300 hover:text-white hover:bg-gray-900/50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${isActive(item.path) ? 'animate-pulse' : ''}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </div>
                  
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" />
                  )}
                </Link>
              ))}
              
      

        

              {isAdminLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-red-900/30 to-red-800/20 text-red-400 hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <FaSignOutAlt className="group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                gsap.to('.mobile-menu', {
                  x: isMenuOpen ? '100%' : '0%',
                  duration: 0.5,
                  ease: 'power3.inOut'
                });
              }}
              className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 text-yellow-400 hover:border-yellow-400/50 transition-all duration-300 group relative z-50"
            >
              <div className="relative">
                {isMenuOpen ? (
                  <FaTimes className="text-2xl group-hover:rotate-90 transition-transform duration-500" />
                ) : (
                  <FaBars className="text-2xl group-hover:rotate-180 transition-transform duration-500" />
                )}
                <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
            </button>
          </div>

          {searchOpen && (
            <div className="hidden lg:block mt-4 animate-fadeIn">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative flex items-center bg-black/90 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
                  <FaSearch className="ml-4 text-yellow-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search movies, directors, actors..."
                    className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="px-4 text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mobile-menu lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transform translate-x-full">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-400/5"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 20}px`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                <GiFilmStrip />
              </div>
            ))}
          </div>

          <div className="relative h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl">
                  <GiClapperboard className="text-2xl text-black" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">CINEMATIC</div>
                  <div className="text-xs text-gray-400 tracking-widest">MOBILE MENU</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl blur opacity-30" />
                <div className="relative flex items-center bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
                  <FaSearch className="ml-4 text-yellow-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 text-yellow-400 hover:text-yellow-300"
                  >
                    <FaPlay className="rotate-90" />
                  </button>
                </div>
              </div>
            </form>

            <div className="flex-1 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${item.color} text-black font-bold`
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </Link>
              ))}

              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-900/50 text-gray-300 hover:bg-gray-800/50 transition-all duration-300"
              >
                {darkMode ? (
                  <>
                    <FaSun className="text-2xl" />
                    <span className="text-lg font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-2xl" />
                    <span className="text-lg font-medium">Dark Mode</span>
                  </>
                )}
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-red-900/30 to-red-800/20 text-red-400 hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300"
                >
                  <FaSignOutAlt className="text-2xl" />
                  <span className="text-lg font-medium">Logout</span>
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-gray-800 mt-8">
              <div className="text-center text-gray-400 text-sm">
                <p className="mb-2">CINEMATIC PREMIERE © 2024</p>
                <p className="flex items-center justify-center space-x-4">
                  <span>🎬</span>
                  <span>🍿</span>
                  <span>🌟</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;