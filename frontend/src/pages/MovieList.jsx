import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { 
  FaStar, 
  FaPlay, 
  FaInfoCircle, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaHeart,
  FaPlus,
  FaChevronRight,
  FaImdb,
  FaYoutube,
  FaFilm,
  FaTimes
} from 'react-icons/fa';
import { 
  GiFilmSpool, 
  GiFilmStrip, 
  GiPopcorn, 
  GiClapperboard 
} from 'react-icons/gi';
import { MdLocalMovies } from 'react-icons/md';
import { BiMoviePlay } from 'react-icons/bi';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const searchRef = useRef(null);
  const movieGridRef = useRef(null);
  const trailerRef = useRef(null);
  const cardRefs = useRef([]);
  const statsRefs = useRef([]);
  const floatElementsRef = useRef([]);

  useEffect(() => {
    fetchMovies();
    initAnimations();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const initAnimations = () => {
    gsap.to(heroRef.current, {
      backgroundPosition: '50% 0%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    floatElementsRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          y: -20,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2
        });
      }
    });
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data || []);
      playSuccessAnimation();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSuccessAnimation = () => {
    gsap.fromTo(
      '.success-pulse',
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );
  };

  const handleCardHover = (movieId, cardIndex) => {
    setHoveredMovie(movieId);
    
    const card = cardRefs.current[cardIndex];
    if (card) {
      gsap.to(card, {
        duration: 0.5,
        scale: 1.05,
        y: -15,
        rotationY: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        ease: 'power3.out'
      });

      gsap.fromTo(
        `.trailer-btn-${movieId}`,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, delay: 0.2 }
      );
    }
  };

  const handleCardLeave = (cardIndex) => {
    setHoveredMovie(null);
    
    const card = cardRefs.current[cardIndex];
    if (card) {
      gsap.to(card, {
        duration: 0.5,
        scale: 1,
        y: 0,
        rotationY: 0,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        ease: 'power3.out'
      });
    }
  };

  const toggleFavorite = (movieId, e) => {
    e.stopPropagation();
    
    const newFavorites = new Set(favorites);
    if (favorites.has(movieId)) {
      newFavorites.delete(movieId);
      gsap.to(`.heart-${movieId}`, {
        scale: 0.5,
        opacity: 0.5,
        duration: 0.3
      });
    } else {
      newFavorites.add(movieId);
      gsap.to(`.heart-${movieId}`, {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(`.heart-${movieId}`, { scale: 1, duration: 0.2 });
        }
      });
    }
    
    setFavorites(newFavorites);
  };

  const filteredMovies = movies.filter(movie => {
    if (!movie) return false;
    const matchesSearch = 
      (movie.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.director || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = 
      selectedGenre === 'All' || (movie.genre || '').includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <GiFilmSpool className="absolute inset-0 text-yellow-400 animate-spin-slow" />
            <GiFilmStrip className="absolute inset-0 text-red-500 animate-spin-slow-reverse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 animate-gradient">
              CINEMATIC
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-8 animate-pulse">
            Loading premium movie experience...
          </p>
          
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 animate-progress" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 3s linear infinite;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fbbf24, #dc2626, #fbbf24);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }
        .movie-card {
          background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
          backdrop-filter: blur(10px);
        }
        .hero-gradient {
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%);
        }
        .stats-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
        }
      `}</style>

     <div
        ref={heroRef}
        className="relative h-screen hero-gradient"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              ref={el => floatElementsRef.current[i] = el}
              className="absolute text-yellow-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 20}px`
              }}
            >
              <GiFilmStrip />
            </div>
          ))}
        </div>

        <div ref={heroContentRef} className="relative h-full flex flex-col justify-center items-center px-4">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full">
                <GiClapperboard className="text-2xl text-black" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="shimmer-text">PREMIERE</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover cinematic masterpieces in 4K. The ultimate movie experience awaits.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-black/90 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
                <FaSearch className="ml-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies, directors, actors..."
                  className="w-full px-4 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="px-4">
                  <span className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {filteredMovies.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 mb-2">EXPLORE</span>
              <div className="w-px h-8 bg-gradient-to-b from-yellow-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <BiMoviePlay />, value: movies.length, label: 'Total Movies', color: 'from-blue-500 to-cyan-400' },
            { icon: <FaStar />, value: movies.reduce((a, b) => a + (b.review_count || 0), 0), label: 'Total Reviews', color: 'from-yellow-400 to-orange-500' },
            { icon: <FaUser />, value: '9.2', label: 'Avg. Rating', color: 'from-purple-500 to-pink-500' },
            { icon: <FaCalendarAlt />, value: '2023', label: 'Latest Release', color: 'from-green-400 to-emerald-500' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="stats-card rounded-2xl p-6 border border-gray-800 transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <div className="text-2xl text-black">{stat.icon}</div>
                </div>
                <div>
                  <div ref={el => statsRefs.current[idx] = el} className="text-3xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Featured Collection
              </span>
            </h2>
            <p className="text-gray-400">Curated selection of must-watch films</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-lg rounded-xl border border-gray-800 px-4 py-2">
                <FaFilter className="text-yellow-400" />
                <select
                  className="bg-transparent text-white focus:outline-none appearance-none"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="All">All Genres</option>
                  {['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'].map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div ref={movieGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMovies.map((movie, index) => (
            <div
              key={movie.id}
              ref={el => cardRefs.current[index] = el}
              className="movie-card rounded-2xl overflow-hidden border border-gray-800 transform transition-all duration-500"
              onMouseEnter={() => handleCardHover(movie.id, index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              {/* Movie Poster */}
              <div className="relative h-80 overflow-hidden">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover transform transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <MdLocalMovies className="text-6xl text-gray-700" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {hoveredMovie === movie.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 via-transparent to-transparent" />
                )}
                
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <FaImdb />
                  <span>{Number(movie.average_rating || 0).toFixed(1)}</span>
                </div>
                
                <button
                  onClick={(e) => toggleFavorite(movie.id, e)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                    favorites.has(movie.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-black/50 text-gray-400 hover:bg-red-500/20'
                  }`}
                >
                  <FaHeart className={`heart-${movie.id}`} />
                </button>
                
             
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold line-clamp-1">
                    {movie.title || 'Untitled'}
                  </h3>
                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <FaInfoCircle />
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {movie.description || 'No description available'}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <FaCalendarAlt className="mr-2 text-yellow-400" />
                    <span>{movie.release_year || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaClock className="mr-2 text-yellow-400" />
                    <span>{movie.duration || 'N/A'} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaUser className="mr-2 text-yellow-400" />
                    <span className="truncate">{movie.director || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre?.split(',').slice(0, 2).map((g, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-xs border border-gray-800"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
                
                <Link
                  to={`/movies/${movie.id}`}
                  className="w-full py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-800"
                >
                  <span>View Details</span>
                  <FaChevronRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-float">🎬</div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                No Movies Found
              </span>
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? `No results for "${searchTerm}"`
                : 'The collection is empty'}
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-full font-bold hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 rounded-xl blur-xl opacity-30 animate-pulse"></div>
            <Link
              to="/admin"
              className="relative px-12 py-5 bg-black text-white rounded-xl border border-gray-800 flex items-center space-x-4 hover:border-yellow-400 transition-all duration-300 group"
            >
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg group-hover:rotate-180 transition-transform duration-500">
                <FaPlus />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Add Your Movie</div>
                <div className="text-gray-400 text-sm">Join our exclusive collection</div>
              </div>
              <FaChevronRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-900 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg">
                <GiClapperboard className="text-xl text-black" />
              </div>
              <div>
                <div className="text-xl font-bold">CINEMATIC PREMIERE</div>
                <div className="text-gray-400 text-sm">The Ultimate Movie Experience</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">© 2024 All rights reserved</span>
              <div className="flex items-center space-x-4">
                <FaImdb className="text-2xl text-yellow-400 hover:scale-110 transition-transform cursor-pointer" />
                <FaYoutube className="text-2xl text-red-500 hover:scale-110 transition-transform cursor-pointer" />
                <FaFilm className="text-2xl text-purple-500 hover:scale-110 transition-transform cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-full shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 z-50 group"
      >
        <div className="relative">
          <GiPopcorn className="text-2xl group-hover:rotate-12 transition-transform" />
          <div className="absolute -inset-2 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
        </div>
      </button>

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;