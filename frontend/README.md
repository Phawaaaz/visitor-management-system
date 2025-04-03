# Visitor Management System - Frontend

A modern, responsive frontend for the Visitor Management System built with React, Vite, and Tailwind CSS.

## Features

- **Responsive Layout**: Optimized for all screen sizes with a collapsible sidebar
- **Authentication**: Secure login and registration system
- **Visitor Management**: 
  - Visitor registration and check-in/out
  - QR code generation and validation
  - Visitor history tracking
- **Department Management**: Organize and manage departments
- **Reports**: Generate and view visitor statistics
- **Real-time Notifications**: Instant updates for visitor arrivals and departures
- **User Management**: Role-based access control (Admin, Receptionist, Security)

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Heroicons
  - Headless UI
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopNav.jsx
│   │   └── visitors/
│   │       ├── VisitorList.jsx
│   │       ├── VisitorForm.jsx
│   │       └── Visitors.jsx
│   ├── utils/
│   │   └── cn.js
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
