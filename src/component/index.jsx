import React, { useState } from 'react';
import { X } from 'lucide-react';

const SCHEMA_OPTIONS = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

export default function SegmentBuilder() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState('');

  const getAvailableOptions = () => {
    const selectedValues = selectedSchemas.map(s => s.value);
    return SCHEMA_OPTIONS.filter(option => !selectedValues.includes(option.value));
  };

  const handleAddSchema = () => {
    if (currentSchema) {
      const selected = SCHEMA_OPTIONS.find(opt => opt.value === currentSchema);
      if (selected) {
        setSelectedSchemas([...selectedSchemas, selected]);
        setCurrentSchema('');
      }
    }
  };

  const handleRemoveSchema = (index) => {
    setSelectedSchemas(selectedSchemas.filter((_, i) => i !== index));
  };

  const handleSchemaChange = (index, newValue) => {
    const newSchema = SCHEMA_OPTIONS.find(opt => opt.value === newValue);
    if (newSchema) {
      const updated = [...selectedSchemas];
      updated[index] = newSchema;
      setSelectedSchemas(updated);
    }
  };

  const handleSaveSegment = async () => {
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({
        [schema.value]: schema.label
      }))
    };

    try {
      await fetch('/3153228f-28c7-437b-8230-0b4db0462b3b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Segment saved:', payload);
      alert('Segment saved successfully!');
      handleClose();
    } catch (error) {
      console.error('Error saving segment:', error);
      alert('Failed to save segment');
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setSegmentName('');
    setSelectedSchemas([]);
    setCurrentSchema('');
  };

  const availableOptionsForDropdown = getAvailableOptions();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded shadow-lg transition"
        >
          Save segment
        </button>

        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-teal-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={handleClose} className="hover:bg-teal-700 p-1 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-medium">Saving Segment</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter the Name of the Segment
                  </label>
                  <input
                    type="text"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="Name of the segment"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  To save your segment, you need to add the schemas to build the query
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>- User Traits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span>- Group Traits</span>
                  </div>
                </div>

                <div className="border-2 border-blue-400 rounded-lg p-4 mb-4 min-h-[150px]">
                  {selectedSchemas.map((schema, index) => {
                    const availableForThis = SCHEMA_OPTIONS.filter(
                      opt => opt.value === schema.value || !selectedSchemas.map(s => s.value).includes(opt.value)
                    );
                    
                    return (
                      <div key={index} className="flex items-center gap-3 mb-3">
                        <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                        <select
                          value={schema.value}
                          onChange={(e) => handleSchemaChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {availableForThis.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveSchema(index)}
                          className="text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    );
                  })}

                  {availableOptionsForDropdown.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></span>
                      <select
                        value={currentSchema}
                        onChange={(e) => setCurrentSchema(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Add schema to segment</option>
                        {availableOptionsForDropdown.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="w-5 flex-shrink-0"></div>
                    </div>
                  )}
                </div>

                {availableOptionsForDropdown.length > 0 && (
                  <button
                    onClick={handleAddSchema}
                    disabled={!currentSchema}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    + Add new schema
                  </button>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleSaveSegment}
                    disabled={!segmentName || selectedSchemas.length === 0}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition"
                  >
                    Save the Segment
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-red-500 hover:text-red-600 px-6 py-2 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}