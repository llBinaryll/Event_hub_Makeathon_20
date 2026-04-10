import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/AlertComponents';
import { eventService } from '../services/eventService';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export const AdminPage = () => {
  const { user } = useAuth();
  const userData = user?.user || user;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If user is a speaker, get only events assigned to them
      if (userData?.role === 'SPEAKER') {
        const events = await eventService.getSpeakerPendingEvents();
        setEvents(Array.isArray(events) ? events : []);
      } else {
        // Admins and organizers see all pending events
        const events = await eventService.getAllEvents({ status: 'PENDING' });
        setEvents(Array.isArray(events) ? events : []);
      }
    } catch (err) {
      setError('Failed to load pending events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      setProcessingId(eventId);
      setError('');
      await eventService.approveEvent(eventId);
      setSuccess('Event approved successfully!');
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to approve event'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (eventId) => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(eventId);
      setError('');
      await eventService.rejectEvent(eventId, rejectReason);
      setSuccess('Event rejected successfully!');
      setEvents(events.filter((e) => e._id !== eventId));
      setRejectingId(null);
      setRejectReason('');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to reject event'
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'ORGANIZER' && userData.role !== 'SPEAKER')) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              Only admins, organizers, and speakers can access this page.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userData?.role === 'SPEAKER' ? 'Pending Events to Review' : 'Event Approvals'}
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              {userData?.role === 'SPEAKER' ? 'Events assigned to you' : 'Review and approve pending events'}
            </p>
          </div>

          {error && (
            <ErrorAlert message={error} onClose={() => setError('')} />
          )}
          {success && (
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          )}

          {events.length === 0 ? (
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-12 text-center border border-white border-opacity-20">
              <p className="text-gray-600 text-lg font-medium">
                ✨ No pending events to review
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white border-opacity-20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Type</p>
                          <p className="font-semibold text-gray-900">
                            {event.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Date & Time</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(event.dateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Location</p>
                          <p className="font-semibold text-gray-900">
                            {event.location || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Capacity</p>
                          <p className="font-semibold text-gray-900">
                            {event.maxParticipants || 'Unlimited'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-2">Speaker</p>
                        <p className="font-semibold text-gray-900">
                          {event.speaker?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 justify-center">
                      {rejectingId === event._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Rejection reason..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger text-sm"
                            rows="3"
                          />
                          <button
                            onClick={() => handleReject(event._id)}
                            disabled={processingId === event._id}
                            className="w-full px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                          >
                            {processingId === event._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason('');
                            }}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors duration-300 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(event._id)}
                            disabled={processingId === event._id}
                            className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                          >
                            {processingId === event._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingId(event._id)}
                            disabled={processingId === event._id}
                            className="w-full px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};
