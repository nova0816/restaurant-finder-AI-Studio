
import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (location: string, preference: string, minRating: number) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('');
  const [preference, setPreference] = useState('');
  const [minRating, setMinRating] = useState(4);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && preference) {
      onSearch(location, preference, minRating);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setUseCurrentLocation(true);
        },
        (error) => {
          console.error("Location error:", error);
          alert("Could not detect location. Please type it manually.");
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Where are you?</label>
            <div className="relative group">
              <span className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <i className="fas fa-location-dot"></i>
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setUseCurrentLocation(false);
                }}
                placeholder="City or Neighborhood"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={detectLocation}
                className={`absolute right-3 top-2.5 p-1.5 rounded-lg transition-all ${
                  useCurrentLocation ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-gray-50'
                }`}
                title="Detect my location"
              >
                <i className="fas fa-crosshairs"></i>
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">What are you craving?</label>
            <div className="relative group">
              <span className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="e.g., Non-western food"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Rating</label>
            <div className="flex items-center space-x-2">
              {[3, 3.5, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    minRating === rating 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                  }`}
                >
                  {rating}+ <i className="fas fa-star text-[10px] ml-0.5"></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !location || !preference}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transform transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing Vibes...
            </span>
          ) : (
            "Find High-Rated Spots"
          )}
        </button>

        <div className="flex flex-wrap gap-2 pt-2">
          {['Non-Western', 'Quiet Work Spot', 'Cheap Eats', 'Romantic Dinner', 'Authentic Asian'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setPreference(tag)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
