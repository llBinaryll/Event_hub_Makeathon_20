# Frontend Architecture & Code Guidelines

## Architecture Overview

The frontend follows a clean, modular architecture:

```
├── Services Layer (API calls)
│   ├── api.js (Axios setup)
│   ├── authService.js
│   ├── eventService.js
│   ├── notificationService.js
│   └── recommendationService.js
│
├── State Management (Context API)
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
│
├── Presentation Layer
│   ├── Pages (Full page components)
│   ├── Components (Reusable UI components)
│   └── Hooks (Custom React hooks)
│
└── Utilities
    ├── dateUtils.js
    ├── validation.js
    └── Custom hooks
```

## Layers Explanation

### 1. Services Layer
Located in `src/services/`, handles all API communication:
```javascript
// Example: eventService.js
export const eventService = {
  getAllEvents: async (filters) => { /* API call */ },
  getEventById: async (eventId) => { /* API call */ },
  // ... more methods
};
```

**Key principles:**
- One service per domain (auth, events, notifications)
- All API calls in services, not in components
- Error handling at service level
- Consistent return format

### 2. State Management (Context API)
Located in `src/context/`, manages global state:

```javascript
// Example: AuthContext.jsx
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email, password) => {
    // Implementation
  };

  return (
    <AuthContext.Provider value={{ user, login, /* ... */ }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**Why Context API?**
- Simple, built-in state management
- No external dependencies
- Perfect for medium-sized apps
- Avoids prop drilling

**Context Providers:**
- `AuthProvider` - Authentication state
- `NotificationProvider` - Notifications state

### 3. Presentation Layer

#### Pages (`src/pages/`)
Full-screen components for routes:
- LoginPage
- RegisterPage
- DashboardPage
- CreateEventPage
- EventDetailPage
- NotificationsPage

**Page Structure:**
```javascript
export const MyPage = () => {
  const { data } = useContext();
  const [state, setState] = useState();
  
  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Page content */}
      </div>
    </>
  );
};
```

#### Components (`src/components/`)
Reusable UI components:
- `Navbar.jsx` - Navigation bar
- `EventCard.jsx` - Event display
- `ProtectedRoute.jsx` - Route protection
- `AlertComponents.jsx` - Alerts
- `NotificationPanel.jsx` - Notifications

**Component Structure:**
```javascript
export const MyComponent = ({ prop1, onAction }) => {
  const [state, setState] = useState();

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};
```

### 4. Utilities (`src/utils/`)
Helper functions:

- `dateUtils.js` - Date formatting, timing
- `validation.js` - Form validation
- API setup in services folder

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Service Function (API call)
    ↓
Context Provider (State update)
    ↓
Re-render Components
```

## Routing Structure

```
/              → Redirect to /login or /dashboard
/login         → Login page (public)
/register      → Register page (public)
/dashboard     → Dashboard (protected)
/create-event  → Create event (protected)
/events/:id    → Event details (protected)
/notifications → Notifications (protected)
```

## Authentication Flow

1. User enters credentials → LoginPage
2. LoginPage calls `useAuth().login()`
3. AuthContext calls authService.login()
4. Service sends POST to `/auth/login`
5. JWT received and stored in localStorage
6. User context updated
7. Redirect to dashboard
8. Protected routes now accessible

## API Request Flow

1. Component needs data
2. Calls service function (e.g., `eventService.getAllEvents()`)
3. Service uses Axios API instance
4. Interceptor adds JWT token automatically
5. Request sent to backend
6. Response or error returned to component
7. Component updates state and re-renders

## Error Handling

**At Service Level:**
```javascript
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  // Handle error
  throw error; // Re-throw to component
}
```

**At Component Level:**
```javascript
try {
  await myService.doSomething();
  setSuccess('Success!');
} catch (error) {
  const message = error.response?.data?.message || 'Error';
  setError(message);
}
```

**In Interceptors:**
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout user
    }
    return Promise.reject(error);
  }
);
```

## State Management Patterns

### Local Component State
For UI state (form inputs, modals, etc.):
```javascript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});
```

### Global Context State
For user-wide state that many components need:
```javascript
const { user, login, logout } = useAuth();
const { notifications, markAsRead } = useNotifications();
```

### Server State
For data from API (managed by context):
```javascript
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(false);
```

## Component Patterns

### Functional Component with Hooks
```javascript
export const MyComponent = ({ data, onAction }) => {
  const { user } = useAuth();
  const [state, setState] = useState();
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleClick = () => {
    onAction(data);
  };

  return <div>{/* JSX */}</div>;
};
```

### Container vs Presentational
```javascript
// Container (smart) - handles logic
export const EventList = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  return <EventListUI events={events} />;
};

// Presentational (dumb) - just renders
const EventListUI = ({ events }) => (
  <div>{events.map(e => <EventCard key={e.id} event={e} />)}</div>
);
```

## Performance Best Practices

1. **Memoization**: Prevent unnecessary re-renders
```javascript
const MyComponent = React.memo(({ data }) => (
  <div>{data}</div>
));
```

2. **useCallback**: Memoize functions
```javascript
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

3. **Code Splitting**: Lazy load pages
```javascript
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

4. **Event Delegation**: Use proper keys in lists
```javascript
{items.map(item => <Item key={item._id} data={item} />)}
```

## Styling Guidelines

- Use Tailwind CSS classes
- Consistent spacing (4px grid)
- Color palette in tailwind.config.js
- Mobile-first responsive design
- BEM class naming when needed

```javascript
<div className="bg-white rounded-lg shadow p-6">
  <h1 className="text-2xl font-bold text-gray-900 mb-4">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

## Testing Approach

1. **Unit Tests**: Service functions
2. **Integration Tests**: Component + Context
3. **E2E Tests**: Full user flows

## Electron Integration

Electron main process (`electron/main.js`):
- Handles window creation
- Loads Vite dev server or production build
- Manages app lifecycle

Renderer process (React app):
- Runs in Electron window
- Access to `window.electron` API
- Native notifications available

## Common Tasks

### Adding a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Import in App.jsx
3. Add route in AppRouter
4. Add navigation link in Navbar

### Adding a New API Service
1. Create `src/services/newService.js`
2. Export functions using `api` instance
3. Import in component
4. Call in useEffect or event handler

### Adding Global State
1. Create context in `src/context/NewContext.jsx`
2. Wrap app with provider in App.jsx
3. Use `useNewContext()` hook in components

### Styling a Component
1. Use Tailwind classes in className
2. Reference colors from tailwind.config.js
3. Keep responsive (mobile-first)
4. Use custom CSS in index.css if needed

## Code Style

- Use ES6+ features (arrow functions, const/let)
- Functional components only (no class components)
- React hooks for state and effects
- Async/await for promises
- Proper error handling always
- Comments for complex logic
