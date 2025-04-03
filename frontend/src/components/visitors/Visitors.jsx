import { useState } from 'react';
import VisitorList from './VisitorList';
import VisitorForm from './VisitorForm';

export default function Visitors() {
  const [showForm, setShowForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);

  const handleAddVisitor = () => {
    setEditingVisitor(null);
    setShowForm(true);
  };

  const handleEditVisitor = (visitor) => {
    setEditingVisitor(visitor);
    setShowForm(true);
  };

  const handleFormSubmit = (values) => {
    // TODO: Implement API call to save visitor
    console.log('Form submitted:', values);
    setShowForm(false);
    setEditingVisitor(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVisitor(null);
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingVisitor ? 'Edit Visitor' : 'New Visitor'}
              </h2>
              <button
                type="button"
                onClick={handleFormCancel}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-w-4xl mx-auto">
              <VisitorForm
                initialValues={editingVisitor}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      ) : (
        <VisitorList onAddVisitor={handleAddVisitor} onEditVisitor={handleEditVisitor} />
      )}
    </div>
  );
} 