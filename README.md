# Visitor Management System

A comprehensive visitor management system with QR code integration, built with a modern tech stack.

## Overview

The Visitor Management System (VMS) is a full-stack application designed to streamline visitor registration, tracking, and management in organizations. It features a responsive web interface and a robust backend API.

## Features

### Core Features
- **Visitor Management**
  - Visitor registration and check-in/out
  - QR code generation and validation
  - Visitor history tracking
  - Host assignment and notifications

- **User Management**
  - Role-based access control (Admin, Receptionist, Security)
  - User authentication and authorization
  - Profile management

- **Department Management**
  - Department creation and management
  - Staff assignment
  - Department-specific visitor tracking

- **Reporting**
  - Visitor statistics and analytics
  - Department-wise reports
  - Export functionality

- **Real-time Features**
  - Instant notifications
  - Live visitor tracking
  - QR code validation

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Heroicons, Headless UI
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Real-time Communication**: Socket.IO
- **Testing**: Jest
- **Validation**: Express Validator

## Project Structure

```
project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/          # Utility functions
│   │   └── ...             # Other frontend files
│   └── package.json
│
├── server/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── ...             # Other backend files
│   └── package.json
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Backend (.env in server directory):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vms
JWT_SECRET=your_jwt_secret
```

Frontend (.env in frontend directory):
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development servers:

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/api-docs`

## API Documentation

The API documentation is available at `/api-docs` when running the backend server. It provides detailed information about:
- Available endpoints
- Request/response formats
- Authentication requirements
- Example requests

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend
1. Build the application:
```bash
cd server
npm run build
```

2. Start the production server:
```bash
npm start
```

### Frontend
1. Build the application:
```bash
cd frontend
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 