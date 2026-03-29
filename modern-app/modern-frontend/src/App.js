import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, User, LayoutDashboard, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const App = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Initial Data
  useEffect(() => {
    fetchBookings();
    fetchDemandPredictions();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('http://localhost:6001/bookings');
    const data = await res.json();
    setBookings(data);
  };

  const fetchDemandPredictions = async () => {
    // This calls your Python Analytics logic via the Node.js bridge
    const res = await fetch('http://localhost:6001/predict-demand');
    const data = await res.json();
    setPredictions(data); // Format: [{ month: 'Jan', demand: 45 }, ...]
  };

  // 2. Trigger Semantic Search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:6001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    });
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10 text-blue-400 font-bold text-xl">
          <Database size={28} />
          <span>HotelAI v2.0</span>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer"><LayoutDashboard size={20} /> Dashboard</li>
          <li className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"><Calendar size={20} /> Bookings</li>
          <li className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"><TrendingUp size={20} /> Analytics</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        {/* Header & Semantic Search Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Booking Intelligence</h1>
            <p className="text-slate-500">AI-driven management & predictive insights</p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Try 'romantic stay with sea view'..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <button type="submit" className="hidden">Search</button>
          </form>
        </header>

        {/* Predictive Dashboard Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                Predicted Monthly Demand
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded">Gradient Boosting Model</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
            <h2 className="text-lg font-medium mb-4 opacity-90">Quick Insights</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm opacity-70 mb-1">Peak Season Projection</p>
                <p className="text-2xl font-bold">December / January</p>
              </div>
              <div>
                <p className="text-sm opacity-70 mb-1">Total Modern Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <button onClick={fetchBookings} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium text-sm">
                Refresh Data
              </button>
            </div>
          </div>
        </section>

        {/* Bookings Table Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
            {loading && <span className="text-blue-500 text-sm animate-pulse italic">AI is thinking...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm font-medium">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Rooms</th>
                  <th className="px-6 py-4">Special Requests</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                        {b.customer_name?.charAt(0)}
                      </div>
                      {b.customer_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {b.rooms?.map((r, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{r.room_type}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                      "{b.special_requests || 'No specific requests'}"
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                      ${b.totalPrice?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;