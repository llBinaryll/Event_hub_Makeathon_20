export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isEventUpcoming = (eventDateTime) => {
  return new Date(eventDateTime) > new Date();
};

export const getTimeUntilEvent = (eventDateTime) => {
  const now = new Date();
  const eventDate = new Date(eventDateTime);
  const diff = eventDate - now;

  if (diff < 0) {
    return 'Event has started';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h`;
};
