import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { addSubtask } from '../features/userSlice';

interface AddSubtaskProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
}

const AddSubtask: React.FC<AddSubtaskProps> = ({ isOpen, onClose, taskId }) => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  const token = sessionStorage.getItem('token') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a subtask title');
    dispatch(addSubtask({ taskId, title, token }));
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0000007a] flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add New Subtask</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subtask Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subtask title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              Add Subtask
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubtask;
