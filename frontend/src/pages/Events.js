import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI } from '../services/api';
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Events = () => {
  const { isAdmin, isFaculty } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'approved' && event.approved) ||
                         (filterStatus === 'pending' && !event.approved);
    
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (eventId) => {
    try {
      await eventsAPI.approveEvent(eventId);
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await eventsAPI.rejectEvent(eventId);
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Browse and manage college events</p>
        </div>
        {isAdmin() && (
          <Link to="/admin/events/create" className="btn btn-primary btn-md">
            Create Event
          </Link>
        )}
        {isFaculty() && (
          <Link to="/faculty/events/create" className="btn btn-primary btn-md">
            Create Event
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <div key={event.id} className="card hover:shadow-lg transition-shadow">
            {event.imageUrl && (
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={eventsAPI.getEventImage(event.imageUrl)}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="card-content">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <span className={`badge ${
                  event.approved ? 'badge-success' : 'badge-warning'
                }`}>
                  {event.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(event.startTime), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  Capacity: {event.capacity}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/events/${event.id}`}
                  className="btn btn-outline btn-sm"
                >
                  View Details
                </Link>
                
                {(isAdmin() || isFaculty()) && !event.approved && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(event.id)}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(event.id)}
                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new event.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;





