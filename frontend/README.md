# Event Hub Desktop Frontend

A production-ready desktop application built with Electron and React for managing and discovering events.

## Features

- 🔐 **Authentication** - Secure JWT-based login and registration
- 📅 **Event Management** - Create, browse, and register for events
- 🔔 **Real-time Notifications** - Get notified about event updates
- 🎯 **Personalized Recommendations** - Smart event suggestions based on preferences
- 🖥️ **Desktop Integration** - Native desktop notifications and app features
- 🎨 **Modern UI** - Built with Tailwind CSS for a clean, responsive design

## Project Structure

```
frontend/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Electron preload script
├── src/
│   ├── components/      # Reusable React components
│   ├── context/         # Context API providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## Pages

### 1. **Login Page** (`/login`)
- User authentication with email and password
- JWT token storage
- Form validation
- Redirect to dashboard on success

### 2. **Register Page** (`/register`)
- New user registration
- Password confirmation
- Role selection
- Redirect to login after successful registration

### 3. **Dashboard** (`/dashboard`)
- Display user's registered events
- Show personalized recommendations
- Show all upcoming events
- Quick stats (registered count, total events, recommendations)
- Event registration/unregistration

### 4. **Create Event** (`/create-event`)
- Form to create new events
- Event details: title, description, type, date, location, max participants
- Success/error handling
- Redirect to dashboard after creation

### 5. **Event Details** (`/events/:eventId`)
- Full event information
- Registration status indicator
- Participant count
- Time until event starts
- Register/Unregister buttons

### 6. **Notifications** (`/notifications`)
- List all notifications
- Unread count display
- Mark as read functionality
- Delete notifications
- 30-second polling for new notifications

## API Integration

All API calls are made to `http://localhost:5000/api` with full integration of backend endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/preferences` - Update user preferences

### Events
- `GET /events` - Get all events (with filters)
- `GET /events/:id` - Get event details
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `PUT /events/:id/approve` - Approve event
- `PUT /events/:id/reject` - Reject event
- `POST /events/:id/register` - Register for event
- `POST /events/:id/unregister` - Unregister from event
- `GET /events/user/registered` - Get user's registered events
- `GET /events/speaker/:id` - Get speaker's events

### Notifications
- `GET /notifications` - Get all notifications
- `GET /notifications/unread/count` - Get unread count
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

### Recommendations
- `GET /recommendations` - Get personalized recommendations
- `GET /recommendations/upcoming` - Get upcoming events
- `GET /recommendations/similar/:id` - Get similar events
- `GET /recommendations/popular` - Get popular events

## State Management

### Context Providers

1. **AuthContext** - Manages authentication state
   - User data
   - Login/register/logout functions
   - Authentication status

2. **NotificationContext** - Manages notifications
   - Notifications list
   - Unread count
   - Mark as read/delete operations

## Components

### Reusable Components
- `Navbar` - Navigation bar with user menu and notification bell
- `EventCard` - Event display card with registration button
- `ProtectedRoute` - Route protection for authenticated pages
- `LoadingSpinner` - Loading indicator
- `ErrorAlert` / `SuccessAlert` - Alert messages
- `NotificationPanel` - Notification dropdown panel

## Hooks

- `useAuth()` - Access authentication context
- `useNotifications()` - Access notifications context
- `useInterval()` - Interval hook for polling
- `useAsync()` - Async data fetching hook

## Utilities

- `dateUtils.js` - Date formatting and event timing
- `validation.js` - Form validation helpers
- `api.js` - Axios instance with JWT interceptors

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

Run development server with hot reload:
```bash
npm run dev
```

Run Electron in development mode:
```bash
npm run electron-dev
```

### Build

Build React app:
```bash
npm run build
```

Build and run Electron app:
```bash
npm run electron-build
```

Create distribution packages:
```bash
npm run dist
```

## Features in Detail

### Authentication
- Secure JWT token storage in localStorage
- Automatic token attachment to API requests
- 401 error handling with redirect to login
- Form validation and error messages

### Event Management
- Browse all approved events
- Filter events by type and status
- Register/unregister for events
- Create new events
- View personal registered events

### Notifications
- Real-time notification polling (30 seconds)
- Unread count badge on navbar
- Mark notifications as read
- Delete notifications
- Native desktop notifications

### Recommendations
- Personalized event suggestions
- Popular events section
- Upcoming events section
- Similar events based on event selection

### Electron Integration
- Native desktop notifications
- Window management
- Built-in development tools
- Fast app startup

## Error Handling

- API error responses are caught and displayed to users
- Network errors show appropriate error messages
- Form validation prevents invalid submissions
- 401 errors automatically logout the user

## Security

- JWT tokens stored securely in localStorage
- API calls include Authorization header with Bearer token
- Password validation (minimum 6 characters)
- Email validation
- No sensitive data in localStorage (except JWT)

## Styling

All styling is done with Tailwind CSS:
- Responsive design for different screen sizes
- Primary color: Blue (#3B82F6)
- Secondary color: Dark Gray (#1F2937)
- Accent color: Green (#10B981)
- Custom scrollbar styling

## Performance Optimizations

- Lazy loading of routes
- Context API for global state (prevents prop drilling)
- Event polling instead of WebSocket (runs every 30 seconds)
- Memoization of components
- Efficient event handlers

## Browser Support

Works on all modern Electron-supported platforms:
- Windows 7+
- macOS 10.11+
- Linux (various distributions)

## Deployment

### For Distribution

1. Build the project:
```bash
npm run dist
```

2. Installers will be created in the `dist` folder

### For Web (React Only)

1. Build:
```bash
npm run build
```

2. Deploy the `dist` folder to any static hosting service

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check if API endpoints match the Postman collection
- Verify JWT tokens are being sent correctly

### Electron Not Starting
- Ensure all dependencies are installed
- Try deleting `node_modules` and reinstalling
- Check if port 5173 (Vite) is not in use

### Notifications Not Working
- Ensure notifications permissions are granted to the app
- Check if backend is sending notifications
- Verify notification polling is working (check Network tab)

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Keep components reusable and modular
4. Add proper error handling
5. Document complex logic

## License

This project is part of the Event Hub Makeathon project.
