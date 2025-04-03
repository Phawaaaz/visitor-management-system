import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Visitors', href: '/visitors', icon: UserGroupIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Reports', href: '/reports', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-end p-2">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <span className="sr-only">Close sidebar</span>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        {!collapsed && (
          <span className="text-lg font-semibold text-gray-900">VMS</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {!collapsed && (
        <div className="flex-shrink-0 p-3 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src='./fawaz.jpg'
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Akinola Fawaz</p>
              <p className="text-xs font-medium text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 