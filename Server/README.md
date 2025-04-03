# Visitor Management System with QR Code Integration

A comprehensive visitor management system built with Node.js, Express, and MongoDB, featuring QR code integration for seamless visitor tracking.

## Features

- Visitor registration and management
- QR code generation and validation
- Host management
- Department/Area management
- Security and access control
- Real-time notifications
- Reporting and analytics

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- QR Code Generation
- Socket.IO (for real-time features)

## Project Structure

```
visitor-management-system/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── tests/               # Test files
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## API Documentation

API documentation will be available at `/api-docs` when the server is running. 