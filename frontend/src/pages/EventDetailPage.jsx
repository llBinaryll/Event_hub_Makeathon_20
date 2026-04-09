import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/AlertComponents';
import { eventService } from '../services/eventService';
import { formatDate, getTimeUntilEvent } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(eventId);
      setEvent(response.data);
      
      // Check if user is registered
      const userRegisteredEvents = await eventService.getUserRegisteredEvents();
      setIsRegistered(
        userRegisteredEvents.data.some((e) => e._id === eventId)
      );
    } catch (err) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await eventService.registerForEvent(eventId);
      setSuccess('Successfully registered for event!');
      setIsRegistered(true);
      await fetchEventDetails();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to register for event'
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistering(true);
      await eventService.unregisterFromEvent(eventId);
      setSuccess('Successfully unregistered from event!');
      setIsRegistered(false);
      await fetchEventDetails();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to unregister from event'
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ErrorAlert message="Event not found" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-primary hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </button>

          {error && (
            <ErrorAlert message={error} onClose={() => setError('')} />
          )}
          {success && (
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Date and Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(event.dateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Time Until Event</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getTimeUntilEvent(event.dateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {event.participants?.length || 0}/{event.maxParticipants}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 h-fit">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Event Type</p>
                  <span className="inline-block bg-primary text-white px-4 py-2 rounded-lg">
                    {event.type}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      event.status === 'APPROVED'
                        ? 'bg-accent text-white'
                        : event.status === 'PENDING'
                        ? 'bg-warning text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {isRegistered ? (
                  <button
                    onClick={handleUnregister}
                    disabled={registering}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {registering ? 'Processing...' : 'Unregister from Event'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {registering ? 'Processing...' : 'Register for Event'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
