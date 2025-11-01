# College Event Management System - Frontend Setup

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open browser**
   Navigate to http://localhost:3000

### Default Users for Testing

You can register new users or use these test accounts (if they exist in your backend):

- **Admin**: admin@college.edu / password123
- **Faculty**: faculty@college.edu / password123  
- **Student**: student@college.edu / password123

### Features Overview

#### 🔐 Authentication
- Secure login/register with JWT tokens
- Role-based access control
- Automatic token refresh

#### 📅 Event Management
- Create, edit, delete events (Admin)
- Approve/reject events (Faculty/Admin)
- Register for events (Students/Faculty)
- Submit feedback after events

#### 👥 User Management
- User CRUD operations (Admin)
- Profile management
- Password updates

#### 📊 Dashboard
- Role-specific dashboards
- Event statistics
- Quick actions

#### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts

### API Integration

The frontend integrates with these backend endpoints:

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Events**: `/api/events/*`, `/api/admin/events/*`
- **Users**: `/api/users/*`, `/api/admin/users/*`
- **Participation**: `/api/participation/*`

### Troubleshooting

#### Common Issues:

1. **CORS Errors**
   - Ensure backend allows requests from http://localhost:3000
   - Check API base URL in .env file

2. **Authentication Issues**
   - Verify JWT token handling
   - Check localStorage for stored tokens

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Development

#### Available Scripts:
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

#### Project Structure:
```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/          # Page components
├── routes/         # Routing setup
├── services/       # API services
└── utils/          # Utility functions
```

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the build folder**
   - Upload `build/` folder to your web server
   - Configure server to serve React app

3. **Environment Configuration**
   - Update API URL for production
   - Configure HTTPS if needed

### Support

For issues or questions:
1. Check the backend API is running
2. Verify environment variables
3. Check browser console for errors
4. Review network requests in DevTools

---

**Ready to manage college events! 🎉**





