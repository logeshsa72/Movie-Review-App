import { useState } from 'react';
import axios from 'axios';
import { 
  FaFilm, 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaTag, 
  FaImage, 
  FaSpinner 
} from 'react-icons/fa';

const AddMovieForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    director: '',
    genre: '',
    duration: 120,
    poster_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/movies', formData);
      
      setSuccess('Movie added successfully!');
      setFormData({
        title: '',
        description: '',
        release_year: new Date().getFullYear(),
        director: '',
        genre: '',
        duration: 120,
        poster_url: ''
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add movie');
      console.error('Error adding movie:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Add New Movie</h2>
          <p className="text-gray-600 mt-2">Fill in the details to add a new movie to the collection</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
          disabled={loading}
        >
          &times;
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center text-green-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaFilm className="mr-2 text-blue-500" />
              Movie Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter movie title"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaUser className="mr-2 text-purple-500" />
              Director *
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter director name"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaCalendarAlt className="mr-2 text-green-500" />
              Release Year *
            </label>
            <input
              type="number"
              name="release_year"
              value={formData.release_year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaClock className="mr-2 text-orange-500" />
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaTag className="mr-2 text-pink-500" />
              Genre *
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Action, Drama, Sci-Fi"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FaImage className="mr-2 text-teal-500" />
              Poster URL
            </label>
            <input
              type="url"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter movie description..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Adding Movie...
              </>
            ) : (
              'Add Movie'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovieForm;