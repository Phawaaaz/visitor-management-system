import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

const mockVisitors = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8900',
    company: 'Acme Corp',
    purpose: 'Business Meeting',
    host: 'Jane Doe',
    department: 'Sales',
    status: 'checked-in',
    checkIn: '2024-03-20T09:00:00',
    checkOut: null,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 234 567 8901',
    company: 'Tech Corp',
    purpose: 'Interview',
    host: 'Mike Wilson',
    department: 'Engineering',
    status: 'scheduled',
    checkIn: null,
    checkOut: null,
  },
  {
    id: 3,
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+1 234 567 8902',
    company: 'Delivery Co',
    purpose: 'Delivery',
    host: 'Alice Cooper',
    department: 'Operations',
    status: 'checked-out',
    checkIn: '2024-03-20T10:00:00',
    checkOut: '2024-03-20T11:00:00',
  },
];

export default function VisitorList({ onAddVisitor, onEditVisitor }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredVisitors = mockVisitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Visitors</h2>
          <button
            type="button"
            onClick={onAddVisitor}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Visitor
          </button>
        </div>

        {/* Filters */}
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search visitors..."
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {/* Table View */}
        <div className="hidden lg:block h-full">
          <div className="overflow-x-auto h-full">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                          <div className="text-sm text-gray-500">{visitor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.company}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.purpose}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.host}</div>
                      <div className="text-sm text-gray-500">{visitor.department}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        visitor.status === 'checked-in'
                          ? 'bg-green-100 text-green-800'
                          : visitor.status === 'checked-out'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {visitor.checkIn ? new Date(visitor.checkIn).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onEditVisitor(visitor)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </button>
                      <button className="text-primary-600 hover:text-primary-900">
                        <QrCodeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden h-full overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4">
            {filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{visitor.name}</h3>
                    <p className="text-sm text-gray-500">{visitor.email}</p>
                  </div>
                  <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${
                    visitor.status === 'checked-in'
                      ? 'bg-green-100 text-green-800'
                      : visitor.status === 'checked-out'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Company:</span> {visitor.company}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> {visitor.purpose}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Host:</span> {visitor.host} ({visitor.department})
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Check In:</span>{' '}
                    {visitor.checkIn ? new Date(visitor.checkIn).toLocaleString() : '-'}
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => onEditVisitor(visitor)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View
                  </button>
                  <button className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <QrCodeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 