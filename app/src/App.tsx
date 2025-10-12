import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store/store';
import { resetLoginSuccess } from './features/userSlice';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const dispatch = useDispatch<AppDispatch>();
  const { loginSuccess } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (loginSuccess) {
      dispatch(resetLoginSuccess());
    }
  }, [dispatch, token]);
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };
  return (
    <>
      <nav className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="text-white font-bold text-xl">Task Manager</h1>
        <div className="flex items-center space-x-6">
          <button onClick={handleLogout} className="text-white underline cursor-pointer">Logout</button>
        </div>
      </nav>
      {token ? children : <Navigate to="/" replace />}
    </>
  );
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
