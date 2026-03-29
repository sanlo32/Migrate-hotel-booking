import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  FiSearch, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiClock,
  FiBriefcase,
  FiLuggage,
  FiWifi,
  FiCoffee,
  FiTv,
  FiAirplay,
  FiInfo,
  FiHeart,
  FiX,
  FiFilter,
  FiStar  // ← This was missing - FIXED
} from "react-icons/fi";
import { MdOutlineFlight, MdOutlineFlightTakeoff, MdOutlineFlightLand } from "react-icons/md";
import { FaPlane, FaBusinessTime } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Flights() {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("oneway");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    class: "economy"
  });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    airline: "all",
    priceRange: { min: 0, max: 2000 },
    stops: "all",
    departureTime: "all",
    sortBy: "price"
  });

  // Sample flight data
 useEffect(() => {
  fetchFlights();
}, []);
const fetchFlights = async () => {
  try {
    setLoading(true);
    const res = await axios.get("http://localhost:8000/flights");
    setFlights(res.data);
    setFilteredFlights(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load flights");
  } finally {
    setLoading(false);
  }
};
const handleSearch = async () => {
  if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.get("http://localhost:8000/flights");

    setFlights(res.data);
    setFilteredFlights(res.data);

    toast.success(`Found ${res.data.length} flights`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to search flights");
  } finally {
    setLoading(false);
  }
};

  const handleFilter = () => {
    let filtered = [...flights];

    // Airline filter
    if (filters.airline !== "all") {
      filtered = filtered.filter(f => f.airline === filters.airline);
    }

    // Price filter
    filtered = filtered.filter(f => f.price >= filters.priceRange.min && f.price <= filters.priceRange.max);

    // Stops filter
    if (filters.stops === "nonstop") {
      filtered = filtered.filter(f => f.stops === 0);
    } else if (filters.stops === "1stop") {
      filtered = filtered.filter(f => f.stops === 1);
    } else if (filters.stops === "2plus") {
      filtered = filtered.filter(f => f.stops >= 2);
    }

    // Sort
    if (filters.sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "duration") {
      filtered.sort((a, b) => {
        const durA = parseInt(a.duration);
        const durB = parseInt(b.duration);
        return durA - durB;
      });
    } else if (filters.sortBy === "departure") {
      filtered.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    setFilteredFlights(filtered);
    setCurrentPage(1);
    toast.info(`Found ${filtered.length} flights`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (flightId) => {
    if (favorites.includes(flightId)) {
      setFavorites(favorites.filter(id => id !== flightId));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, flightId]);
      toast.success("Added to favorites");
    }
  };

  const getAmenityIcon = (amenity) => {
    switch(amenity) {
      case 'wifi': return <FiWifi className="w-3 h-3" />;
      case 'meal': return <FiCoffee className="w-3 h-3" />;
      case 'entertainment': return <FiTv className="w-3 h-3" />;
      case 'lounge': return <FiBriefcase className="w-3 h-3" />;
      case 'bed': return <FiAirplay className="w-3 h-3" />;
      default: return null;
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FiStar key={i} className="w-3 h-3 fill-current text-yellow-400" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FiStar key={i} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    );
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowDetailsModal(true);
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const getUniqueAirlines = () => {
    const airlines = ["all", ...new Set(flights.map(f => f.airline))];
    return airlines;
  };
const popularCities = [
  { code: "BOM", name: "Mumbai" },
  { code: "DEL", name: "Delhi" },
  { code: "BLR", name: "Bangalore" },
  { code: "MAA", name: "Chennai" },
  { code: "HYD", name: "Hyderabad" },
  { code: "CCU", name: "Kolkata" }
];
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Flight Search</h1>
                <p className="text-gray-600 mt-1">Find and book the best flights for your journey</p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="p-6">
              {/* Trip Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSearchType("oneway")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    searchType === "oneway"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  One Way
                </button>
                <button
                  onClick={() => setSearchType("roundtrip")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    searchType === "roundtrip"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Round Trip
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From *
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City or Airport"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                    />
                  </div>
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To *
                  </label>
                  <div className="relative">
                    <MdOutlineFlightLand className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City or Airport"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                    />
                  </div>
                </div>

                {/* Depart Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchParams.departDate}
                      onChange={(e) => setSearchParams({...searchParams, departDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Return Date (for round trip) */}
                {searchType === "roundtrip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return *
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {/* Passengers & Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers & Class
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchParams.passengers}
                        onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})}
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchParams.class}
                      onChange={(e) => setSearchParams({...searchParams, class: e.target.value})}
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Popular Cities */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
                <div className="flex flex-wrap gap-2">
                  {popularCities.slice(0, 6).map(city => (
                    <button
                      key={city.code}
                      onClick={() => setSearchParams({...searchParams, to: `${city.name} (${city.code})`})}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {city.name} ({city.code})
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Searching Flights...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiSearch className="w-5 h-5" />
                    Search Flights
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {flights.length > 0 && (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Flights
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredFlights.length} flights found
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Airline Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.airline}
                        onChange={(e) => setFilters({...filters, airline: e.target.value})}
                      >
                        {getUniqueAirlines().map(airline => (
                          <option key={airline} value={airline}>
                            {airline === "all" ? "All Airlines" : airline}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: parseInt(e.target.value)}})}
                      >
                        <option value={2000}>$2,000+</option>
                        <option value={1000}>$1,000</option>
                        <option value={500}>$500</option>
                        <option value={300}>$300</option>
                        <option value={200}>$200</option>
                      </select>
                    </div>

                    {/* Stops */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.stops}
                        onChange={(e) => setFilters({...filters, stops: e.target.value})}
                      >
                        <option value="all">Any Stops</option>
                        <option value="nonstop">Non-stop Only</option>
                        <option value="1stop">1 Stop Only</option>
                        <option value="2plus">2+ Stops</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      >
                        <option value="price">Price: Low to High</option>
                        <option value="duration">Duration: Shortest</option>
                        <option value="departure">Departure: Earliest</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleFilter}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Flight Cards */}
              <div className="space-y-4">
                {currentFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
                        {/* Airline Info */}
                        <div className="flex items-center gap-4 w-48">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FaPlane className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                          </div>
                        </div>

                        {/* Flight Details */}
                        <div className="flex-1 flex items-center justify-between gap-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{flight.departureTime}</p>
                            <p className="text-xs text-gray-500">{flight.from}</p>
                          </div>
                          <div className="flex-1 px-4">
                            <div className="relative">
                              <div className="border-t-2 border-dashed border-gray-300"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-2 rounded-full">
                                <p className="text-xs text-gray-500">{flight.duration}</p>
                              </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-1">
                              {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{flight.arrivalTime}</p>
                            <p className="text-xs text-gray-500">{flight.to}</p>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex gap-2">
                          {flight.amenities.map((amenity, i) => (
                            <div key={i} className="p-1.5 bg-gray-100 rounded-lg" title={amenity}>
                              {getAmenityIcon(amenity)}
                            </div>
                          ))}
                        </div>

                        {/* Price & Actions */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{flight.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">per passenger</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => toggleFavorite(flight.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiHeart className={favorites.includes(flight.id) ? "fill-red-500 text-red-500" : ""} />
                            </button>
                            <button
                              onClick={() => handleViewDetails(flight)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiInfo />
                            </button>
                            <button
                              onClick={() => handleBookNow(flight)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {renderStars(flight.rating)}
                        <span className="text-xs text-gray-500">{flight.rating} rating</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredFlights.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex flex-wrap justify-between items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFlights.length)} of {filteredFlights.length} flights
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
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Flight Details Modal */}
      {showDetailsModal && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Flight Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaPlane className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedFlight.airline}</h2>
                  <p className="text-gray-600">Flight {selectedFlight.flightNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Departure</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedFlight.departureTime}</p>
                  <p className="text-gray-600">{selectedFlight.from}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Arrival</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedFlight.arrivalTime}</p>
                  <p className="text-gray-600">{selectedFlight.to}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Flight Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{selectedFlight.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stops</p>
                    <p className="font-medium">{selectedFlight.stops === 0 ? "Non-stop" : `${selectedFlight.stops} stop(s)`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="font-medium capitalize">{selectedFlight.class}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-bold text-blue-600">₹{selectedFlight.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedFlight.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleBookNow(selectedFlight);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Book Flight</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">{selectedFlight.airline} - {selectedFlight.flightNumber}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {selectedFlight.departureTime} - {selectedFlight.arrivalTime} ({selectedFlight.duration})
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Passengers</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per passenger</span>
                  <span className="font-semibold">₹{selectedFlight.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-semibold">{searchParams.passengers}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">
                      ₹{(selectedFlight.price * searchParams.passengers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;