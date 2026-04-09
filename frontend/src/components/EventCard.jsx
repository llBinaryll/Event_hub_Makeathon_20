import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { formatDate, getTimeUntilEvent } from '../utils/dateUtils';

export const EventCard = ({ event, isRegistered, onRegister, onUnregister }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
      <div onClick={handleCardClick} className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
      </div>

      <div className="space-y-2 text-gray-700 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDate(event.dateTime)}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{getTimeUntilEvent(event.dateTime)}</span>
        </div>
        {event.maxParticipants && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>
              {event.participants?.length || 0}/{event.maxParticipants}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {isRegistered ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnregister(event._id);
            }}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Unregister
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event._id);
            }}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};
