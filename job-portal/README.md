# Job Portal

A modern job portal application built with React, Material UI, and JWT authentication. Users can create, view, edit, and delete job postings after authentication.

## Features

- 🔐 **JWT Authentication** - Secure login and registration
- 🛡️ **Private Routing** - Protected pages accessible only to authenticated users
- ✨ **Complete CRUD Operations** - Create, Read, Update, Delete job postings
- 📱 **Responsive Design** - Material UI components with mobile-first approach
- ⚡ **Loading States** - User-friendly loading indicators and disabled states
- 🎯 **Form Validation** - Email format validation and password strength requirements
- 🔄 **Error Handling** - Comprehensive error handling with user feedback

## Tech Stack

- **Frontend**: React 18, Material UI 5, React Router v6
- **HTTP Client**: Axios with JWT token interceptors
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Material UI with responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running (see API Endpoints section)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd job-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_BASE_URL=https://your-api-server.com/api
REACT_APP_ACCESS_TOKEN_KEY=accessToken
```

### 4. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

The application expects the following API endpoints to be available:

### Authentication
- `POST /sign_up` - User registration
  - Body: `{ username, email, password }`
- `POST /sign_in` - User login
  - Body: `{ email, password }`
  - Returns: `{ token }`

### Jobs (Requires Authentication Token)
- `GET /jobs` - Fetch all jobs
- `POST /jobs` - Create new job
  - Body: `{ title, description }`
- `PUT /jobs/:id` - Update existing job
  - Body: `{ title, description }`
- `DELETE /jobs/:id` - Delete job

**Note**: All job endpoints require the `Authorization: Bearer <token>` header.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with logout
│   └── JobCard.jsx     # Individual job display card
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication context and JWT handling
├── pages/              # Main application pages
│   ├── Home.jsx        # Job listing and management page
│   ├── Login.jsx       # User login page
│   └── Register.jsx    # User registration page
├── routes/             # Routing components
│   └── PrivateRoute.jsx # Protected route wrapper
├── services/           # API service layers
│   ├── api.js          # Axios configuration with interceptors
│   └── jobService.js   # Job-related API calls
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Usage

### 1. Registration
- Navigate to `/register`
- Fill in username (min 3 characters), email, and password (min 6 characters)
- Click "Register" to create account

### 2. Login
- Navigate to `/login`
- Enter email and password
- Click "Login" to authenticate

### 3. Job Management
After successful login:
- **View Jobs**: All jobs are displayed in a responsive grid
- **Create Job**: Fill in title and description, click "Add Job"
- **Edit Job**: Click "Edit" on any job card, modify details, click "Update Job"
- **Delete Job**: Click "Delete" on any job card (with confirmation)
- **Logout**: Click "Logout" in the header

## Security Features

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Private routing prevents unauthorized access
- Form validation and input sanitization
- Error handling for failed requests

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting Service
The `build` folder can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables for Production
Make sure to set the production API URL in your hosting service's environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.
