import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Calendar, User, 
  Trash2, Search, CheckCircle, Clock,
  Filter, ChevronRight, MessageSquare,
  Building, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.ENQUIRIES);
      setEnquiries(res.data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`${API_ENDPOINTS.ENQUIRIES}/${id}`);
      setEnquiries(enquiries.filter(e => e._id !== id));
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_ENDPOINTS.ENQUIRIES}/${id}/status`, { status });
      setEnquiries(enquiries.map(e => e._id === id ? res.data : e));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-600';
      case 'Read': return 'bg-yellow-100 text-yellow-600';
      case 'Resolved': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Enquiry Management</h1>
          <p className="text-slate-500 mt-1">Review and manage business enquiries from your website.</p>
        </div>
        <button 
          onClick={fetchEnquiries}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-400 transition-all text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-slate-400 transition-all text-slate-700 min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100">
          <RefreshCw className="animate-spin text-slate-300 mb-4" size={40} />
          <p className="text-slate-500">Loading enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
          <MessageSquare size={60} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900">No enquiries found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEnquiries.map((enquiry) => (
            <div 
              key={enquiry._id} 
              className={`bg-white rounded-xl border transition-all duration-300 ${enquiry.status === 'New' ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-200 shadow-sm hover:shadow-md'}`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </div>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(enquiry.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                      {enquiry.name}
                      {enquiry.company && (
                        <span className="text-slate-400 font-normal text-base flex items-center gap-1">
                          <Building size={16} /> @ {enquiry.company}
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-slate-600 mb-6">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <Mail size={16} /> {enquiry.email}
                      </a>
                      <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <Phone size={16} /> {enquiry.phone}
                      </a>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject: {enquiry.subject || 'General Enquiry'}</div>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 justify-end lg:border-l border-slate-100 lg:pl-6 min-w-[160px]">
                    {enquiry.status === 'New' && (
                      <button 
                        onClick={() => updateStatus(enquiry._id, 'Read')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-semibold"
                      >
                        Mark as Read
                      </button>
                    )}
                    {enquiry.status !== 'Resolved' && (
                      <button 
                        onClick={() => updateStatus(enquiry._id, 'Resolved')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-semibold"
                      >
                        <CheckCircle size={16} /> Resolved
                      </button>
                    )}
                    <button 
                      onClick={() => deleteEnquiry(enquiry._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;
