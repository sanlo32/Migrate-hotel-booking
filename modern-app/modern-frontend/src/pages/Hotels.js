import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  FiMapPin, 
  FiStar, 
  FiSearch, 
  FiFilter, 
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiWifi,
  FiCoffee,
  FiUsers,
  FiPhone,
  FiMail,
  FiCalendar,
  FiHeart,
  FiInfo,
  FiX,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import { 
  MdOutlineHotel, 
  MdOutlineRestaurant, 
  MdOutlinePool,
  MdLocalParking,
  MdFitnessCenter,
  MdSpa
} from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching hotels from API...");
      const response = await axios.get("http://localhost:7000/hotels");
      
      console.log("API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        // Enhance the data with default values for missing fields
        const enhancedHotels = response.data.map((hotel, index) => ({
  id: hotel.id || index + 1,
  name: hotel.name,
  city: hotel.city,
  description: hotel.description,
  image: hotel.image,

  //  ADD THIS (CRITICAL FIX)
  roomTypes: hotel.roomTypes || [
    { type: "Single", price: 100 },
    { type: "Double", price: 200 },
    { type: "Suite", price: 400 }
  ],

  rating: hotel.rating || 4.5,
  pricePerNight: hotel.pricePerNight || 200,

  wifi: hotel.wifi ?? true,
  parking: hotel.parking ?? true,
  restaurant: hotel.restaurant ?? true,
  pool: hotel.pool ?? true,
  gym: hotel.gym ?? false,
  spa: hotel.spa ?? false
}));
        
        setHotels(enhancedHotels);
        
        if (enhancedHotels.length === 0) {
          toast.info("No hotels found in the database");
        } else {
          toast.success(`Loaded ${enhancedHotels.length} hotels`);
        }
      } else {
        setError("Invalid data format received from server");
        setHotels([]);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please check if the backend server is running on port 7000");
        toast.error("Backend server not reachable");
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        toast.error(`Server error: ${err.response.status}`);
      } else {
        setError("Failed to load hotels. Please try again.");
        toast.error("Failed to load hotels");
      }
      
      // Set fallback demo data
      setHotels(getDemoHotels());
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get hotel images based on name
  const getHotelImage = (hotelName) => {
    const imageMap = {
      'Taj Hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      'Leela Palace': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'Oberoi': 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400',
      'Marriott': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
      'Hyatt': 'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=400',
      'Hilton': 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400'
    };
    return imageMap[hotelName] || `https://picsum.photos/seed/${hotelName}/400/300`;
  };

  // Demo data for testing
  const getDemoHotels = () => {
    return [
      {
        id: 1,
        name: "Taj Hotel",
        city: "Mumbai",
        rating: 4.8,
        pricePerNight: 299,
        description: "Luxury hotel in the heart of Mumbai with stunning city views and world-class amenities",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        wifi: true,
        parking: true,
        restaurant: true,
        pool: true,
        gym: true
      },
      {
        id: 2,
        name: "Leela Palace",
        city: "Delhi",
        rating: 4.7,
        pricePerNight: 349,
        description: "Experience royal hospitality at Leela Palace, Delhi's premier luxury hotel",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
        wifi: true,
        parking: true,
        restaurant: true,
        pool: true,
        spa: true
      },
      {
        id: 3,
        name: "Oberoi Grand",
        city: "Kolkata",
        rating: 4.6,
        pricePerNight: 279,
        description: "Heritage luxury hotel in the heart of Kolkata",
        image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400",
        wifi: true,
        parking: true,
        restaurant: true,
        pool: true
      },
      {
        id: 4,
        name: "ITC Grand Chola",
        city: "Chennai",
        rating: 4.5,
        pricePerNight: 259,
        description: "Luxury hotel with traditional South Indian architecture",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
        wifi: true,
        parking: true,
        restaurant: true,
        gym: true
      },
      {
        id: 5,
        name: "JW Marriott",
        city: "Bangalore",
        rating: 4.4,
        pricePerNight: 239,
        description: "Modern luxury in the heart of Bangalore's business district",
        image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=400",
        wifi: true,
        parking: true,
        restaurant: true,
        pool: true
      },
      {
        id: 6,
        name: "The Park",
        city: "Hyderabad",
        rating: 4.3,
        pricePerNight: 219,
        description: "Contemporary hotel with vibrant atmosphere",
        image: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400",
        wifi: true,
        parking: true,
        restaurant: true
      }
    ];
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Get unique cities for filter
  const cities = ["all", ...new Set(hotels.map(hotel => hotel.city).filter(Boolean))];

  // Filter hotels
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
                         hotel.city?.toLowerCase().includes(search.toLowerCase()) ||
                         hotel.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCity = selectedCity === "all" || hotel.city === selectedCity;
    
    const matchesPrice = (hotel.pricePerNight || 0) >= priceRange.min && 
                         (hotel.pricePerNight || 0) <= priceRange.max;
    
    const matchesRating = (hotel.rating || 0) >= selectedRating;
    
    return matchesSearch && matchesCity && matchesPrice && matchesRating;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats
  const stats = {
    total: filteredHotels.length,
    cities: cities.length - 1,
    avgPrice: Math.floor(filteredHotels.reduce((sum, h) => sum + (h.pricePerNight || 0), 0) / filteredHotels.length) || 0,
    topRated: filteredHotels.filter(h => (h.rating || 0) >= 4.5).length
  };

  // Toggle favorite
  const toggleFavorite = (hotelId) => {
    if (favorites.includes(hotelId)) {
      setFavorites(favorites.filter(id => id !== hotelId));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, hotelId]);
      toast.success("Added to favorites");
    }
  };

  // Render stars - FIXED VERSION
  const renderStars = (rating) => {
    // Ensure rating is a number and handle invalid values
    const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    
    // Clamp rating between 0 and 5
    const clampedRating = Math.min(Math.max(numRating, 0), 5);
    
    const fullStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - Math.ceil(clampedRating));
    
    return (
      <div className="flex items-center gap-1">
        {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
          <FiStar key={`full-${i}`} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div key="half" className="relative">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <FiStar className="w-4 h-4 fill-current text-yellow-400" />
            </div>
          </div>
        )}
        {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
          <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{clampedRating.toFixed(1)}</span>
      </div>
    );
  };

  // Get amenities icons
  const getAmenities = (hotel) => {
    const amenities = [];
    if (hotel.wifi) amenities.push({ icon: FiWifi, name: "Free WiFi" });
    if (hotel.parking) amenities.push({ icon: MdLocalParking, name: "Parking" });
    if (hotel.restaurant) amenities.push({ icon: MdOutlineRestaurant, name: "Restaurant" });
    if (hotel.pool) amenities.push({ icon: MdOutlinePool, name: "Swimming Pool" });
    if (hotel.gym) amenities.push({ icon: MdFitnessCenter, name: "Fitness Center" });
    if (hotel.spa) amenities.push({ icon: MdSpa, name: "Spa" });
    return amenities.slice(0, 4);
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowDetailsModal(true);
  };

  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };
const handleBooking = async () => {
  try {
    if (!formData.customer_name || !formData.check_in || !formData.check_out) {
      alert("Please fill all required fields");
      return;
    }

    const roomsWithPrice = formData.rooms.map(r => {
      const roomInfo = selectedHotel.roomTypes.find(rt => rt.type === r.room_type);

      return {
        room_type: r.room_type,
        price: roomInfo?.price || 0,
        guests: Number(r.guests)
      };
    });

    const payload = {
      customer_name: formData.customer_name,
      rooms: roomsWithPrice,
      check_in: formData.check_in,
      check_out: formData.check_out
    };

    await axios.post("http://localhost:6001/bookings", payload);

    alert("Booking successful!");

    setShowBookingModal(false);
  } catch (err) {
    console.error(err);
    alert("Booking failed");
  }
};
  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSelectedCity("all");
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(0);
    setCurrentPage(1);
  };
const [formData, setFormData] = useState({
  customer_name: "",
  email: "",
  phone: "",
  check_in: "",
  check_out: "",
  rooms: [{ room_type: "", guests: 1 }]
});



const nights = formData.check_in && formData.check_out
  ? Math.max(
      1,
      Math.ceil(
        (new Date(formData.check_out) - new Date(formData.check_in)) /
        (1000 * 60 * 60 * 24)
      )
    )
  : 1;

const total = formData.rooms.reduce((sum, room) => {
  const roomInfo = selectedHotel?.roomTypes?.find(
    (r) => r.type === room.room_type
  );

  return sum + ((roomInfo?.price || 0) * nights);
}, 0);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotels & Accommodations</h1>
              <p className="text-gray-600 mt-1">Discover the best hotels for your next stay</p>
            </div>
            <button 
              onClick={fetchHotels}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Hotels</p>
                <h3 className="text-3xl font-bold">{stats.total}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <MdOutlineHotel className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm mb-1">Destinations</p>
                <h3 className="text-3xl font-bold">{stats.cities}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiMapPin className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm mb-1">Avg. Nightly Rate</p>
                <h3 className="text-3xl font-bold">${stats.avgPrice}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm mb-1">Top Rated</p>
                <h3 className="text-3xl font-bold">{stats.topRated}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiStar className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-700">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by name, city..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              {/* City Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === "all" ? "All Cities" : city}
                  </option>
                ))}
              </select>
              
              {/* Price Range */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={`${priceRange.min}-${priceRange.max}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange({ min, max });
                  setCurrentPage(1);
                }}
              >
                <option value="0-1000">All Prices</option>
                <option value="0-150">Under $150</option>
                <option value="150-250">$150 - $250</option>
                <option value="250-350">$250 - $350</option>
                <option value="350-500">$350 - $500</option>
                <option value="500-1000">$500+</option>
              </select>
              
              {/* Rating Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="0">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
              <div className="text-sm text-gray-600">
                Found {filteredHotels.length} hotels
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading hotels...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Hotels</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchHotels} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : currentHotels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <FiSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleFavorite(hotel.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <FiHeart className={`w-5 h-5 ${favorites.includes(hotel.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      {renderStars(hotel.rating)}
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <FiMapPin className="w-4 h-4" />
                      <span>{hotel.city}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                    
                    {/* Amenities */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                      {getAmenities(hotel).map((amenity, i) => {
                        const Icon = amenity.icon;
                        return (
                          <div key={i} className="flex items-center gap-1 text-gray-500 text-xs" title={amenity.name}>
                            <Icon className="w-3 h-3" />
                            <span className="hidden sm:inline">{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Price and Actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${hotel.pricePerNight}
                        </p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(hotel)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiInfo className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBookNow(hotel)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredHotels.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex flex-wrap justify-between items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredHotels.length)} of {filteredHotels.length} hotels
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={18}>18 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hotel Details Modal */}
      {showDetailsModal && selectedHotel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Hotel Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedHotel.image}
                    alt={selectedHotel.name}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedHotel.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <FiMapPin className="text-gray-400" />
                    <span className="text-gray-600">{selectedHotel.city}</span>
                  </div>
                  <div className="mb-4">{renderStars(selectedHotel.rating)}</div>
                  <p className="text-gray-600 mb-4">{selectedHotel.description}</p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAmenities(selectedHotel).map((amenity, i) => {
                        const Icon = amenity.icon;
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon className="w-4 h-4" />
                            <span>{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        ${formData.rooms[0]?.room_type
  ? selectedHotel.roomTypes.find(r => r.type === formData.rooms[0].room_type)?.price || 0
  : 0}
                      </p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleBookNow(selectedHotel);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
{showBookingModal && selectedHotel && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300" 
    onClick={() => setShowBookingModal(false)}
  >
    <div 
      className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 animate-slideUp" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Complete Your Booking</h3>
          <p className="text-blue-100 text-sm mt-1">{selectedHotel.name}</p>
        </div>
        <button 
          onClick={() => setShowBookingModal(false)} 
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
        <div className="p-6">
          {/* Hotel Summary Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex gap-4">
              <img 
                src={selectedHotel.image} 
                alt={selectedHotel.name}
                className="w-20 h-20 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{selectedHotel.name}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <FiMapPin className="w-3 h-3" />
                  <span>{selectedHotel.city}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(selectedHotel.rating)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">${selectedHotel.pricePerNight}</p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
            {/* Guest Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
                Guest Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1 234 567 890"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
                Stay Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.check_in}
                      onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.check_out}
                      onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={formData.check_in || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded"></div>
                  Rooms & Guests
                </h4>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    rooms: [...formData.rooms, { room_type: "", guests: 1 }]
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  + Add Room
                </button>
              </div>
              
              {formData.rooms.map((room, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Room {index + 1}</span>
                    {formData.rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedRooms = formData.rooms.filter((_, i) => i !== index);
                          setFormData({...formData, rooms: updatedRooms});
                        }}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Room Type *
                      </label>
                      <select
                        value={room.room_type}
                        onChange={(e) => {
                          const updated = [...formData.rooms];
                          updated[index].room_type = e.target.value;
                          setFormData({...formData, rooms: updated});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Select Room Type</option>
                        {selectedHotel.roomTypes?.map((r, i) => (
                          <option key={i} value={r.type}>
                            {r.type} - ${r.price}/night
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={room.guests}
                          onChange={(e) => {
                            const updated = [...formData.rooms];
                            updated[index].guests = parseInt(e.target.value) || 1;
                            setFormData({...formData, rooms: updated});
                          }}
                          min="1"
                          max="4"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room rate per night</span>
                  <span className="font-medium">${selectedHotel.pricePerNight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of rooms</span>
                  <span className="font-medium">{formData.rooms.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of nights</span>
                  <span className="font-medium">
                    {formData.check_in && formData.check_out ? 
                      Math.max(1, Math.ceil((new Date(formData.check_out) - new Date(formData.check_in)) / (1000 * 60 * 60 * 24))) : 1
                    }
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="text-2xl text-blue-600">
  ${total.toFixed(2)}
</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
}

export default Hotels;