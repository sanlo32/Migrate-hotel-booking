// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // import Navbar from "../components/Navbar";
// // import Sidebar from "../components/Sidebar";
// // import StatsCard from "../components/StatsCard";
// // import BookingCard from "../components/BookingCard";

// // function Dashboard() {
// //   const [bookings, setBookings] = useState([]);

// //   useEffect(() => {
// //     axios.get("http://localhost:6001/bookings")
// //       .then(res => setBookings(res.data))
// //       .catch(err => console.error(err));
// //   }, []);

// //   return (
// //     <div className="flex h-screen bg-gray-100">

// //       <Sidebar />

// //       <div className="flex-1 p-6 overflow-y-auto">

// //         <Navbar />

// //         {/* Stats */}
// //         <div className="grid grid-cols-3 gap-4 mb-6">
// //           <StatsCard title="Total Bookings" value={bookings.length} />
// //           <StatsCard
// //             title="Rooms Booked"
// //             value={bookings.reduce((acc, b) => acc + b.rooms.length, 0)}
// //           />
// //           <StatsCard title="Customers" value={bookings.length} />
// //         </div>

// //         {/* Booking Cards */}
// //         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {bookings.map((b, i) => (
// //             <BookingCard key={i} booking={b} />
// //           ))}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   FiCalendar, 
//   FiUsers, 
//   FiDollarSign,
//   FiRefreshCw,
//   FiAlertCircle,
//   FiChevronLeft,
//   FiChevronRight
// } from "react-icons/fi";
// import { MdOutlineHotel } from "react-icons/md";
// import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";

// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import StatsCard from "../components/StatsCard";
// import BookingCard from "../components/BookingCard";

// function Dashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(6);

//   const fetchBookings = async () => {
//     try {
//       setError(null);
//       const response = await axios.get("http://localhost:6001/bookings");
//       setBookings(response.data);
//     } catch (err) {
//       setError("Failed to load bookings. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchBookings();
//     setCurrentPage(1); // Reset to first page on refresh
//   };

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     // Scroll to top when changing pages
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   // Calculate statistics
//   const totalBookings = bookings.length;
//   const totalRooms = bookings.reduce((acc, b) => acc + (b.rooms?.length || 0), 0);
//   const totalCustomers = totalBookings;
//   const averageBookingValue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0) / totalBookings || 0;
//   const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
  
//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = 5;
    
//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//       const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
//       if (startPage > 1) {
//         pageNumbers.push(1);
//         if (startPage > 2) pageNumbers.push('...');
//       }
      
//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
      
//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) pageNumbers.push('...');
//         pageNumbers.push(totalPages);
//       }
//     }
    
//     return pageNumbers;
//   };

//   const statsData = [
//     {
//       title: "Total Bookings",
//       value: totalBookings,
//       icon: FiCalendar,
//       color: "from-blue-500 to-blue-600",
//       bgColor: "bg-blue-50",
//       textColor: "text-blue-600",
//       trend: "+12%",
//       trendUp: true,
//       description: "vs last month"
//     },
//     {
//       title: "Rooms Booked",
//       value: totalRooms,
//       icon: MdOutlineHotel,
//       color: "from-purple-500 to-purple-600",
//       bgColor: "bg-purple-50",
//       textColor: "text-purple-600",
//       trend: "+8%",
//       trendUp: true,
//       description: "vs last month"
//     },
//     {
//       title: "Active Customers",
//       value: totalCustomers,
//       icon: FiUsers,
//       color: "from-green-500 to-green-600",
//       bgColor: "bg-green-50",
//       textColor: "text-green-600",
//       trend: "+15%",
//       trendUp: true,
//       description: "vs last month"
//     },
//     {
//       title: "Avg. Booking Value",
//       value: `$${averageBookingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//       icon: FiDollarSign,
//       color: "from-orange-500 to-orange-600",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-600",
//       trend: "+5%",
//       trendUp: true,
//       description: "vs last month"
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Sidebar />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading your dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 overflow-y-auto">
//         <Navbar />
        
//         <div className="p-6 lg:p-8">
//           {/* Header Section */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-2">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//                 <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your bookings today.</p>
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm ${
//                     refreshing ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                   <span className="text-sm font-medium">Refresh</span>
//                 </button>
//               </div>
//             </div>
            
//             {/* Quick Stats Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               {statsData.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
//                         <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
//                       </div>
//                       <div className="flex items-center gap-1">
//                         {stat.trendUp ? (
//                           <BiTrendingUp className="w-4 h-4 text-green-500" />
//                         ) : (
//                           <BiTrendingDown className="w-4 h-4 text-red-500" />
//                         )}
//                         <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
//                           {stat.trend}
//                         </span>
//                       </div>
//                     </div>
//                     <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
//                     <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
//                     <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
//                   </div>
//                   <div className={`h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Error State */}
//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
//               <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//               <div className="flex-1">
//                 <p className="text-red-700 font-medium">{error}</p>
//                 <p className="text-red-600 text-sm mt-1">Please check your connection and try again.</p>
//               </div>
//               <button
//                 onClick={handleRefresh}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {/* Bookings Section */}
//           <div className="mt-8">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
//                 <p className="text-gray-600 text-sm mt-1">
//                   Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, bookings.length)} of {bookings.length} bookings
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-600">Show:</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1); // Reset to first page when changing items per page
//                   }}
//                   className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value={6}>6</option>
//                   <option value={9}>9</option>
//                   <option value={12}>12</option>
//                   <option value={24}>24</option>
//                 </select>
//               </div>
//             </div>

//             {bookings.length === 0 ? (
//               <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
//                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FiCalendar className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
//                 <p className="text-gray-600 mb-6">Start by creating your first booking to see it here.</p>
//                 <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
//                   Create New Booking
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {/* Stats Summary */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                   <div className="bg-white rounded-xl p-4 shadow-sm">
//                     <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
//                     <p className="text-xl font-bold text-gray-900">
//                       ${totalRevenue.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 shadow-sm">
//                     <p className="text-xs text-gray-500 mb-1">Avg. Stay Duration</p>
//                     <p className="text-xl font-bold text-gray-900">3.2 days</p>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 shadow-sm">
//                     <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
//                     <p className="text-xl font-bold text-green-600">94%</p>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 shadow-sm">
//                     <p className="text-xs text-gray-500 mb-1">Active Bookings</p>
//                     <p className="text-xl font-bold text-blue-600">{bookings.length}</p>
//                   </div>
//                 </div>

//                 {/* Booking Cards Grid */}
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {currentBookings.map((booking, index) => (
//                     <div
//                       key={index}
//                       className="transform transition-all duration-300 hover:-translate-y-1"
//                     >
//                       <BookingCard booking={booking} />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
//                     <div className="text-sm text-gray-600">
//                       Page {currentPage} of {totalPages}
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <button
//                         onClick={handlePreviousPage}
//                         disabled={currentPage === 1}
//                         className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors flex items-center gap-1 ${
//                           currentPage === 1
//                             ? 'opacity-50 cursor-not-allowed bg-gray-50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <FiChevronLeft className="w-4 h-4" />
//                         <span>Previous</span>
//                       </button>
                      
//                       <div className="flex gap-1">
//                         {getPageNumbers().map((page, index) => (
//                           page === '...' ? (
//                             <span key={index} className="px-3 py-2 text-gray-500">
//                               ...
//                             </span>
//                           ) : (
//                             <button
//                               key={index}
//                               onClick={() => handlePageChange(page)}
//                               className={`px-4 py-2 rounded-lg transition-colors ${
//                                 currentPage === page
//                                   ? 'bg-blue-600 text-white shadow-sm'
//                                   : 'border border-gray-300 hover:bg-gray-50'
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           )
//                         ))}
//                       </div>
                      
//                       <button
//                         onClick={handleNextPage}
//                         disabled={currentPage === totalPages}
//                         className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors flex items-center gap-1 ${
//                           currentPage === totalPages
//                             ? 'opacity-50 cursor-not-allowed bg-gray-50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <span>Next</span>
//                         <FiChevronRight className="w-4 h-4" />
//                       </button>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-600">Go to page:</span>
//                       <input
//                         type="number"
//                         min={1}
//                         max={totalPages}
//                         value={currentPage}
//                         onChange={(e) => {
//                           const page = parseInt(e.target.value);
//                           if (page >= 1 && page <= totalPages) {
//                             handlePageChange(page);
//                           }
//                         }}
//                         className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiActivity
} from "react-icons/fi";
import { MdOutlineHotel } from "react-icons/md";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BookingCard from "../components/BookingCard";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  const fetchBookings = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:6001/bookings");
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRooms = bookings.reduce((acc, b) => acc + (b.rooms?.length || 0), 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
  const averageBookingValue = totalRevenue / totalBookings || 0;
  
  // Sample chart data (replace with real data from your API)
  const bookingTrendData = [
    { name: 'Mon', bookings: 12, revenue: 2400 },
    { name: 'Tue', bookings: 19, revenue: 3800 },
    { name: 'Wed', bookings: 15, revenue: 3000 },
    { name: 'Thu', bookings: 22, revenue: 4400 },
    { name: 'Fri', bookings: 28, revenue: 5600 },
    { name: 'Sat', bookings: 35, revenue: 7000 },
    { name: 'Sun', bookings: 30, revenue: 6000 },
  ];

  const roomTypeData = [
    { name: 'Deluxe', value: 45, color: '#3B82F6' },
    { name: 'Suite', value: 25, color: '#8B5CF6' },
    { name: 'Standard', value: 30, color: '#10B981' },
  ];

  const statsData = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: FiCalendar,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      trend: "+12.5%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Rooms Booked",
      value: totalRooms,
      icon: MdOutlineHotel,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
      trend: "+8.2%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      textColor: "text-green-600",
      trend: "+23.1%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Avg. Booking Value",
      value: `$${averageBookingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiBarChart2,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      trend: "+5.4%",
      trendUp: true,
      description: "vs last month"
    }
  ];

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FiActivity className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium mt-4">Loading your dashboard...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        
        <div className="p-6 lg:p-8">
          {/* Animated Header */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <FiActivity className="w-4 h-4 text-blue-500 animate-pulse" />
                  Welcome back! Here's what's happening with your bookings today.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
                  {['day', 'week', 'month', 'year'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeframe(time)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTimeframe === time
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm ${
                    refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                  }`}
                >
                  <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                      {stat.trendUp ? (
                        <FiTrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <FiTrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Booking Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
                  <p className="text-sm text-gray-500 mt-1">Weekly booking activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Bookings</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bookingTrendData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Room Distribution Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Room Distribution</h3>
                  <p className="text-sm text-gray-500 mt-1">Popular room types</p>
                </div>
                <FiBarChart2 className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {roomTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 animate-shake">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-xl">
                  <FiAlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-800 font-semibold mb-1">Error Loading Data</h4>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, bookings.length)} of {bookings.length} bookings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value={6}>6 per page</option>
                  <option value={9}>9 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <FiCalendar className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start by creating your first booking to see it appear here. Your booking history will be displayed beautifully.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                  Create New Booking
                </button>
              </div>
            ) : (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <FiDollarSign className="w-5 h-5 text-green-500" />
                      <FiTrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <FiClock className="w-5 h-5 text-blue-500 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">Avg. Stay Duration</p>
                    <p className="text-xl font-bold text-gray-900">3.2 days</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <FiCheckCircle className="w-5 h-5 text-green-500 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                    <p className="text-xl font-bold text-green-600">94%</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <FiUsers className="w-5 h-5 text-purple-500 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">Active Bookings</p>
                    <p className="text-xl font-bold text-purple-600">{bookings.length}</p>
                  </div>
                </div>

                {/* Booking Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="transform transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BookingCard booking={booking} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 ${
                          currentPage === 1
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        <span className="text-sm">Previous</span>
                      </button>
                      
                      <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={index} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-xl transition-all duration-200 font-medium ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="text-sm">Next</span>
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Go to:</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            handlePageChange(page);
                          }
                        }}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;