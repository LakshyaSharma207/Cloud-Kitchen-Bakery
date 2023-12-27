import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Main from './components/Main';
import Login from './components/Login/Login';
import { setUserDetails } from "./context/actions/userActions";
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import { app } from './config/firebase.config';
import { getAuth } from 'firebase/auth';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
      if (user) {
        await user.reload();
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUserDetails(user));
      } else {
        console.log('User is signed out');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App
