# College Event Management System - Frontend

A modern, responsive React frontend for the College Event Management System built with Spring Boot.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS
- **Role-based Authentication** (Admin, Faculty, Student)
- **Responsive Design** for all devices
- **JWT Token Management** with automatic refresh
- **Real-time Notifications** with react-hot-toast
- **Form Validation** with react-hook-form
- **Image Upload** for events
- **CSV Export** for event participants
- **Clean Component Architecture**

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-event-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 User Roles & Features

### 👨‍💼 Admin
- **Dashboard**: Overview of all system statistics
- **User Management**: Create, read, update, delete users
- **Event Management**: Full CRUD operations for events
- **CSV Export**: Download participant lists
- **Event Approval**: Approve/reject events

### 👨‍🏫 Faculty
- **Dashboard**: Personal dashboard with relevant stats
- **Event Approval**: Approve/reject events
- **Event Registration**: Register for events
- **Feedback**: Submit feedback for attended events
- **Profile Management**: Update personal information

### 👨‍🎓 Student
- **Dashboard**: Personal dashboard with registered events
- **Event Browsing**: View and search approved events
- **Event Registration**: Register for events
- **Feedback**: Submit feedback for attended events
- **Profile Management**: Update personal information

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (LoadingSpinner, etc.)
│   └── layout/          # Layout components (Layout, AdminLayout)
├── contexts/            # React contexts (AuthContext)
├── pages/               # Page components
│   ├── admin/           # Admin-specific pages
│   ├── auth/            # Authentication pages
│   └── ...              # Other pages
├── routes/               # Routing configuration
├── services/             # API services
└── utils/                # Utility functions
```

## 🔐 Authentication Flow

1. **Login/Register**: Users authenticate with email/password
2. **JWT Token**: Server returns JWT token for subsequent requests
3. **Token Storage**: Token stored in localStorage
4. **Auto Refresh**: Token automatically included in API requests
5. **Role-based Routing**: Users redirected based on their role

## 🎨 UI Components

### Design System
- **Colors**: Primary blue theme with semantic colors
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable button, input, card, badge components

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl breakpoints
- **Grid System**: CSS Grid and Flexbox layouts
- **Navigation**: Collapsible sidebar navigation

## 🔌 API Integration

The frontend integrates with the Spring Boot backend through RESTful APIs:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Events**: `/api/events/*`, `/api/admin/events/*`
- **Users**: `/api/users/*`, `/api/admin/users/*`
- **Participation**: `/api/participation/*`

## 🚀 Getting Started

1. **Ensure Backend is Running**
   - Start the Spring Boot backend on `http://localhost:8080`
   - Database should be configured and running

2. **Start Frontend Development Server**
   ```bash
   npm start
   ```
   - Frontend will be available at `http://localhost:3000`

3. **Test the Application**
   - Register a new user or login with existing credentials
   - Explore features based on your role

## 📱 Responsive Features

- **Mobile Navigation**: Hamburger menu for mobile devices
- **Touch-friendly**: Large touch targets for mobile
- **Responsive Tables**: Horizontal scroll on small screens
- **Adaptive Layouts**: Components adapt to screen size

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles in individual files

### API Configuration
- Update `src/services/api.js` for API endpoint changes
- Modify base URL in environment variables

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration allows frontend origin
   - Check API base URL configuration

2. **Authentication Issues**
   - Verify JWT token is being sent correctly
   - Check token expiration handling

3. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for version compatibility issues

## 📄 License

This project is part of the College Event Management System.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding! 🎉**





