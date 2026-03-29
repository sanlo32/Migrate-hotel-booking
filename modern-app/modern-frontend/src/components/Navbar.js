import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bell, User, Settings, LogOut, ChevronDown, LayoutDashboard, ClipboardList, Hotel, Plane } from "lucide-react";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New booking received from John Smith", time: "5 min ago", unread: true },
    { id: 2, text: "Payment of $299 confirmed", time: "1 hour ago", unread: true },
    { id: 3, text: "Welcome to Modern Booking Dashboard", time: "3 hours ago", unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  BookingHub
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">Manage your bookings efficiently</p>
              </Link>
              
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-2">
                <NavLink to="/" icon={<LayoutDashboard size={18} />} active={isActive('/') || isActive('/dashboard')}>
                  Dashboard
                </NavLink>
                <NavLink to="/bookings" icon={<ClipboardList size={18} />} active={isActive('/bookings')}>
                  Bookings
                </NavLink>
                <NavLink to="/hotels" icon={<Hotel size={18} />} active={isActive('/hotels')}>
                  Hotels
                </NavLink>
                <NavLink to="/flights" icon={<Plane size={18} />} active={isActive('/flights')}>
                  Flights
                </NavLink>
              </div>
            </div>

            {/* Right side icons and user menu */}
            <div className="flex items-center space-x-4">
              {/* Stats Badge */}
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Today: 12 bookings</span>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                              notification.unread ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <DropdownItem icon={<User size={16} />} to="/profile">
                      My Profile
                    </DropdownItem>
                    <DropdownItem icon={<Settings size={16} />} to="/settings">
                      Settings
                    </DropdownItem>
                    <div className="border-t border-gray-200 my-1"></div>
                    <DropdownItem icon={<LogOut size={16} />} to="/logout" className="text-red-600">
                      Logout
                    </DropdownItem>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
              <div className="space-y-1">
                <MobileNavLink to="/" icon={<LayoutDashboard size={18} />} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/bookings" icon={<ClipboardList size={18} />} onClick={() => setIsMobileMenuOpen(false)}>
                  Bookings
                </MobileNavLink>
                <MobileNavLink to="/hotels" icon={<Hotel size={18} />} onClick={() => setIsMobileMenuOpen(false)}>
                  Hotels
                </MobileNavLink>
                <MobileNavLink to="/flights" icon={<Plane size={18} />} onClick={() => setIsMobileMenuOpen(false)}>
                  Flights
                </MobileNavLink>
              </div>
              
              {/* Mobile Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-3 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

// Helper Components
function NavLink({ to, children, icon, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ to, children, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function DropdownItem({ icon, children, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default Navbar;