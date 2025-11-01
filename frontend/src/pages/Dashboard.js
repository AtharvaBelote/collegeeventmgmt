import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, participationAPI } from '../services/api';
import { Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    approvedEvents: 0,
    pendingEvents: 0,
    registeredEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Dashboard: Starting to fetch data...');
      
      // Fetch all events
      console.log('Dashboard: Fetching all events...');
      const eventsResponse = await eventsAPI.getAllEvents();
      const allEvents = eventsResponse.data || [];
      console.log('Dashboard: All events fetched:', allEvents.length);
      
      // Fetch approved events
      console.log('Dashboard: Fetching approved events...');
      const approvedResponse = await eventsAPI.getApprovedEvents();
      const approvedEvents = approvedResponse.data || [];
      console.log('Dashboard: Approved events fetched:', approvedEvents.length);
      
      // Fetch registered events for students/faculty
      let registeredCount = 0;
      try {
        if (isStudent() || isFaculty()) {
          const registeredResponse = await participationAPI.getRegisteredEvents();
          const registeredEvents = registeredResponse.data || [];
          registeredCount = registeredEvents.length;
        }
      } catch (err) {
        console.warn('Could not fetch registered events:', err);
      }
      
      // Calculate stats
      const totalEvents = allEvents.length;
      const approvedCount = approvedEvents.length;
      const pendingCount = totalEvents - approvedCount;
      
      setStats({
        totalEvents,
        approvedEvents: approvedCount,
        pendingEvents: pendingCount,
        registeredEvents: registeredCount,
      });
      
      // Set recent events (last 5, sorted by start time)
      const sortedEvents = [...allEvents].sort((a, b) => 
        new Date(b.startTime) - new Date(a.startTime)
      );
      setRecentEvents(sortedEvents.slice(0, 5));
      console.log('Dashboard: Recent events set:', sortedEvents.slice(0, 5).length);
      console.log('Dashboard: Stats calculated:', {
        totalEvents,
        approvedCount,
        pendingCount,
        registeredCount
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedStats = () => {
    if (isAdmin()) {
      return [
        { name: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'blue' },
        { name: 'Approved Events', value: stats.approvedEvents, icon: CheckCircle, color: 'green' },
        { name: 'Pending Events', value: stats.pendingEvents, icon: Clock, color: 'yellow' },
        { name: 'Total Users', value: 0, icon: Users, color: 'purple' },
      ];
    } else if (isFaculty()) {
      return [
        { name: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'blue' },
        { name: 'Approved Events', value: stats.approvedEvents, icon: CheckCircle, color: 'green' },
        { name: 'Pending Events', value: stats.pendingEvents, icon: Clock, color: 'yellow' },
        { name: 'My Registrations', value: stats.registeredEvents, icon: Users, color: 'purple' },
      ];
    } else {
      return [
        { name: 'Available Events', value: stats.approvedEvents, icon: Calendar, color: 'blue' },
        { name: 'My Registrations', value: stats.registeredEvents, icon: Users, color: 'green' },
        { name: 'Upcoming Events', value: 0, icon: Clock, color: 'yellow' },
        { name: 'Completed Events', value: 0, icon: CheckCircle, color: 'purple' },
      ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.fullName}!
        </h1>
        <p className="text-gray-600">
          Welcome to your {user?.role?.toLowerCase()} dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {getRoleBasedStats().map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
          };
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${colorClasses[stat.color] || colorClasses.blue}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
        </div>
        <div className="card-content">
          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(event.startTime), 'MMM dd, yyyy - h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${
                      event.approved ? 'badge-success' : 'badge-warning'
                    }`}>
                      {event.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-4">
                {isAdmin() 
                  ? "Get started by creating your first event." 
                  : "Check back later for upcoming events."}
              </p>
              {isAdmin() && (
                <button className="btn btn-primary btn-sm">
                  Create Event
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isAdmin() && (
              <>
                <button className="btn btn-primary btn-md w-full">
                  Create New Event
                </button>
                <button className="btn btn-outline btn-md w-full">
                  Manage Users
                </button>
                <button className="btn btn-outline btn-md w-full">
                  View Reports
                </button>
              </>
            )}
            {isFaculty() && (
              <>
                <button className="btn btn-primary btn-md w-full">
                  Approve Events
                </button>
                <button className="btn btn-outline btn-md w-full">
                  Register for Event
                </button>
              </>
            )}
            {isStudent() && (
              <>
                <button className="btn btn-primary btn-md w-full">
                  Browse Events
                </button>
                <button className="btn btn-outline btn-md w-full">
                  My Registrations
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





