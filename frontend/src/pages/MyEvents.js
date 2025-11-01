import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { participationAPI, eventsAPI } from '../services/api';
import { Calendar, MapPin, Users, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyEvents = () => {
  const { user, isStudent, isFaculty } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isStudent() || isFaculty()) {
      fetchRegisteredEvents();
    }
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      const response = await participationAPI.getRegisteredEvents();
      console.log('MyEvents: Registered events response:', response.data);
      
      // Get full event details for each registration
      const registrationsWithEvents = await Promise.all(
        (response.data || []).map(async (registration) => {
          try {
            const eventResponse = await eventsAPI.getEventById(registration.eventId);
            return {
              ...registration,
              event: eventResponse.data
            };
          } catch (error) {
            console.error('Error fetching event details:', error);
            return {
              ...registration,
              event: {
                id: registration.eventId,
                name: registration.eventName,
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                venue: 'Unknown',
                capacity: 0,
                description: 'Event details unavailable'
              }
            };
          }
        })
      );
      
      setRegisteredEvents(registrationsWithEvents);
    } catch (error) {
      console.error('Error fetching registered events:', error);
      setRegisteredEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-600">Events you've registered for</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Registrations</p>
                <p className="text-2xl font-semibold text-gray-900">{registeredEvents.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registeredEvents.filter(registration => new Date(registration.event.startTime) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-gray-100">
                  <MessageSquare className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Feedback Given</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registeredEvents.filter(event => event.feedback).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {registeredEvents.length > 0 ? (
          registeredEvents.map((registration) => {
            const event = registration.event;
            const isUpcoming = new Date(event.startTime) > new Date();
            const isPast = new Date(event.endTime) < new Date();
            
            return (
              <div key={registration.id} className="card hover:shadow-lg transition-shadow">
                <div className="card-content">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`badge ${
                            isUpcoming ? 'badge-success' : 
                            isPast ? 'badge-default' : 'badge-warning'
                          }`}>
                            {isUpcoming ? 'Upcoming' : isPast ? 'Completed' : 'In Progress'}
                          </span>
                          {registration.feedback && (
                            <span className="badge badge-success">
                              Feedback Given
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </Link>
                      {isPast && !registration.feedback && (
                        <Link
                          to={`/events/${event.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Give Feedback
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registered events</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't registered for any events yet. Browse available events to get started.
            </p>
            <div className="mt-6">
              <Link to="/events" className="btn btn-primary btn-md">
                Browse Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;





