import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  FiSearch, 
  FiUser, 
  FiCalendar, 
  FiHome, 
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign
} from "react-icons/fi";
import { MdOutlineHotel, MdOutlineRoom } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterRoomType, setFilterRoomType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:6001/bookings");

// 🔥 ADD THIS TRANSFORMATION HERE
const normalized = response.data.map(b => ({
  ...b,
  rooms: b.rooms || [
    {
      room_type: b.room_type,
      guests: b.guests || 1,
      price: b.price || 0
    }
  ]
}));

setBookings(normalized);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    // Search filter
const matchesSearch =
  booking.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
  booking.email?.toLowerCase().includes(search.toLowerCase()) ||
  booking.rooms?.some(r =>
    r.room_type?.toLowerCase().includes(search.toLowerCase())
  ) || false;   
    // Room type filter
const matchesRoomType =
  filterRoomType === "all" ||
  booking.rooms?.some(r => r.room_type === filterRoomType);    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start && booking.check_in) {
      matchesDateRange = new Date(booking.check_in) >= new Date(dateRange.start);
    }
    if (dateRange.end && booking.check_out && matchesDateRange) {
      matchesDateRange = new Date(booking.check_out) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesRoomType && matchesDateRange;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats
  const stats = {
    total: filteredBookings.length,
    totalRooms: filteredBookings.reduce((sum, b) => sum + (b.rooms?.length || 0), 0),
    totalRevenue: filteredBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    uniqueCustomers: new Set(filteredBookings.map(b => b.customer_name)).size
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Customer Name", "Room Type", "Check In", "Check Out", "Guests", "Total Price", "Email", "Phone"];
    const csvData = filteredBookings.map(booking => [
      booking.customer_name,
      booking.rooms?.map(r => r.room_type).join("|"),
      booking.check_in ? new Date(booking.check_in).toISOString().split("T")[0] : "",
      booking.check_out ? new Date(booking.check_out).toISOString().split("T")[0] : "",
      booking.rooms?.reduce((sum, r) => sum + (r.guests || 1), 0),
      booking.totalPrice ? `$${booking.totalPrice}` : "",
      booking.email || "",
      booking.phone || ""
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully!");
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Get unique room types for filter
const roomTypes = [
  "all",
  ...Array.from(
    new Set(
      bookings.flatMap(b => b.rooms?.map(r => r.room_type) || [])
    )
  ).filter(Boolean)
];
  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterRoomType("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all customer reservations</p>
            </div>
            <button 
              onClick={fetchBookings}
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
                <p className="text-blue-100 text-sm mb-1">Total Bookings</p>
                <h3 className="text-3xl font-bold">{stats.total}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiCalendar className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm mb-1">Rooms Booked</p>
                <h3 className="text-3xl font-bold">{stats.totalRooms}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <MdOutlineRoom className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm mb-1">Unique Customers</p>
                <h3 className="text-3xl font-bold">{stats.uniqueCustomers}</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <FiUser className="w-6 h-6" />
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
                  placeholder="Search by name, email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              {/* Room Type Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRoomType}
                onChange={(e) => {
                  setFilterRoomType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Room Types" : type}
                  </option>
                ))}
              </select>
              
              {/* Date Range */}
              <input
                type="date"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Check In From"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
              
              <input
                type="date"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Check Out To"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <FiDownload className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchBookings} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Try Again
              </button>
            </div>
          ) : currentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiSearch className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rooms</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentBookings.map((booking, index) => (
                      <tr key={booking.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {booking.customer_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{booking.customer_name}</p>
                              {booking.email && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <FiMail className="w-3 h-3" /> {booking.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {booking.rooms?.map(r => r.room_type).join(", ") || "Standard"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            {booking.check_in ? new Date(booking.check_in).toISOString().split("T")[0] : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            {booking.check_out ? new Date(booking.check_out).toISOString().split("T")[0] : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {booking.rooms?.length || 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-900">
                            ${booking.totalPrice?.toLocaleString() || "0"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredBookings.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} entries
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
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Customer Name</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedBooking.customer_name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Room Type</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedBooking.rooms?.map(r => r.room_type).join(", ") || "Standard"}</p>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Rooms</label>
                  {selectedBooking.rooms?.map((room, i) => (
                    <div key={i} className="text-sm text-gray-700 mt-1">
                      🏨 {room.room_type} - ${room.price} - {room.guests || 1} guest(s)
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check In</label>
                  <p className="text-gray-900 mt-1">{selectedBooking.check_in ? new Date(selectedBooking.check_in).toISOString().split("T")[0] : "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check Out</label>
                  <p className="text-gray-900 mt-1">{selectedBooking.check_out ? new Date(selectedBooking.check_out).toISOString().split("T")[0] : "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Number of Rooms</label>
                  <p className="text-gray-900 mt-1">{selectedBooking.rooms?.length || 1}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Total Price</label>
                  <p className="text-2xl font-bold text-green-600 mt-1">${selectedBooking.totalPrice?.toLocaleString() || "0"}</p>
                </div>
                {selectedBooking.email && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <FiMail className="w-4 h-4" /> {selectedBooking.email}
                    </p>
                  </div>
                )}
                {selectedBooking.phone && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <FiPhone className="w-4 h-4" /> {selectedBooking.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Bookings;