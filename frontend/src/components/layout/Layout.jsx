import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      <div className="flex h-full w-full">
        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <div
            className={`fixed inset-0 z-40 flex transform transition-transform ease-in-out duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
                sidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-full flex-col">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0 h-full">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-gray-100">
            <div className="h-full w-full p-4 sm:p-6 mx-auto bg-rounded-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 