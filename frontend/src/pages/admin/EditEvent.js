import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventsAPI } from '../../services/api';
import { Calendar, MapPin, Users, Upload, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setInitialLoading(true);
      const response = await eventsAPI.getEventById(id);
      const event = response.data;
      
      // Format dates for datetime-local input
      const startTime = new Date(event.startTime).toISOString().slice(0, 16);
      const endTime = new Date(event.endTime).toISOString().slice(0, 16);
      
      reset({
        name: event.name,
        description: event.description,
        organizer: event.organizer,
        startTime: startTime,
        endTime: endTime,
        venue: event.venue,
        capacity: event.capacity,
      });

      if (event.imageUrl) {
        setImagePreview(eventsAPI.getEventImage(event.imageUrl));
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Update event
      const eventData = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        capacity: parseInt(data.capacity),
      };

      await eventsAPI.updateEvent(id, eventData);

      // Upload new image if provided
      if (imageFile) {
        try {
          await eventsAPI.uploadEventImage(id, imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Event updated but image upload failed');
        }
      }

      toast.success('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600">Update event details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              <div className="card-content space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input mt-1"
                    placeholder="Enter event name"
                    {...register('name', { required: 'Event name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="input mt-1"
                    placeholder="Enter event description"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    className="input mt-1"
                    placeholder="Enter organizer name"
                    {...register('organizer', { required: 'Organizer is required' })}
                  />
                  {errors.organizer && (
                    <p className="mt-1 text-sm text-red-600">{errors.organizer.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Date & Time</h3>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      className="input mt-1"
                      {...register('startTime', { required: 'Start time is required' })}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      className="input mt-1"
                      {...register('endTime', { 
                        required: 'End time is required',
                        validate: value => {
                          if (startTime && new Date(value) <= new Date(startTime)) {
                            return 'End time must be after start time';
                          }
                        }
                      })}
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location and Capacity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Location & Capacity</h3>
              </div>
              <div className="card-content space-y-4">
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                    Venue *
                  </label>
                  <input
                    type="text"
                    id="venue"
                    className="input mt-1"
                    placeholder="Enter venue location"
                    {...register('venue', { required: 'Venue is required' })}
                  />
                  {errors.venue && (
                    <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    className="input mt-1"
                    placeholder="Enter maximum capacity"
                    {...register('capacity', { 
                      required: 'Capacity is required',
                      min: { value: 1, message: 'Capacity must be at least 1' }
                    })}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Event Image</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="btn btn-outline btn-sm w-full"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="image" className="btn btn-outline btn-sm cursor-pointer">
                          Upload New Image
                        </label>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
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
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-md w-full"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Update Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline btn-md w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;





