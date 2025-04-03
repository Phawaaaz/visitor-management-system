import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/layout/Layout';
import Visitors from './components/visitors/Visitors';

// Placeholder components for routes
const Dashboard = () => (
  <div className="bg-white shadow rounded-lg p-6 lg:w-full mx-auto">
    <h1 className="text-2xl font-semibold text-gray-900 mb-4 ">Dashboard</h1>
    <p className="text-gray-600">Welcome to your dashboard!</p>
  </div>
);

const Departments = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Departments</h1>
    <p className="text-gray-600">Manage your departments here.</p>
  </div>
);

const Reports = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Reports</h1>
    <p className="text-gray-600">View your reports here.</p>
  </div>
);

const Settings = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Settings</h1>
    <p className="text-gray-600">Manage your settings here.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
