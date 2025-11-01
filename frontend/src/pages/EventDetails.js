import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, participationAPI } from '../services/api';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEventById(id);
      setEvent(response.data);
      
      // Check if user is registered for this event
      if (isStudent() || isFaculty()) {
        try {
          const registrationsResponse = await participationAPI.getRegisteredEvents();
          const userRegistrations = registrationsResponse.data;
          console.log('EventDetails: User registrations:', userRegistrations);
          console.log('EventDetails: Checking for event ID:', id);
          
          // Check both possible structures: new (with event object) and old (with eventId)
          const isRegistered = userRegistrations.some(reg => {
            const eventId = reg.event?.id || reg.eventId;
            return eventId === parseInt(id);
          });
          
          console.log('EventDetails: Is registered:', isRegistered);
          setRegistered(isRegistered);
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await participationAPI.registerForEvent(id);
      setRegistered(true);
      toast.success('Successfully registered for the event!');
    } catch (error) {
      toast.error('Failed to register for the event');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter feedback');
      return;
    }

    try {
      setSubmittingFeedback(true);
      await participationAPI.submitFeedback(id, feedback);
      toast.success('Feedback submitted successfully!');
      setFeedback('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleApprove = async () => {
    try {
      await eventsAPI.approveEvent(id);
      setEvent({ ...event, approved: true });
      toast.success('Event approved successfully!');
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async () => {
    try {
      await eventsAPI.rejectEvent(id);
      setEvent({ ...event, approved: false });
      toast.success('Event rejected');
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Event not found</h3>
        <p className="text-gray-500">The event you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary btn-md mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
          <p className="text-gray-600">Event Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="card">
              <div className="p-0">
                <img
                  src={eventsAPI.getEventImage(event.imageUrl)}
                  alt={event.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
            </div>
          )}

          {/* Event Description */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
            </div>
            <div className="card-content">
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Feedback Section */}
          {(isStudent() || isFaculty()) && registered && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Submit Feedback</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      className="input"
                      placeholder="Share your thoughts about this event..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={submittingFeedback}
                    className="btn btn-primary btn-md"
                  >
                    {submittingFeedback ? <LoadingSpinner size="sm" /> : 'Submit Feedback'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Event Information</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">{format(new Date(event.startTime), 'EEEE, MMMM dd, yyyy')}</p>
                    <p className="text-gray-500">{format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{event.venue}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Capacity: {event.capacity} people</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Organizer: {event.organizer}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className={`badge ${
                    event.approved ? 'badge-success' : 'badge-warning'
                  }`}>
                    {event.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {(isStudent() || isFaculty()) && !registered && event.approved && (
                  <button
                    onClick={handleRegister}
                    className="btn btn-primary btn-md w-full"
                  >
                    Register for Event
                  </button>
                )}
                
                {(isStudent() || isFaculty()) && registered && (
                  <div className="text-center">
                    <span className="badge badge-success">Registered</span>
                    <p className="text-sm text-gray-500 mt-2">You're registered for this event</p>
                  </div>
                )}
                
                {(isAdmin() || isFaculty()) && !event.approved && (
                  <div className="space-y-2">
                    <button
                      onClick={handleApprove}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700 w-full"
                    >
                      Approve Event
                    </button>
                    <button
                      onClick={handleReject}
                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700 w-full"
                    >
                      Reject Event
                    </button>
                  </div>
                )}
                
                {isAdmin() && (
                  <div className="space-y-2">
                    <button className="btn btn-outline btn-sm w-full">
                      Edit Event
                    </button>
                    <button className="btn btn-outline btn-sm w-full">
                      Download Participants
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;





