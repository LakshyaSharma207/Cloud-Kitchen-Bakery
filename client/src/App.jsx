import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Main from './components/Main';
import Login from './components/Login/Login';
import { app } from './config/firebase.config';
import { validateUserJWTToken } from './api';
import { getAuth } from 'firebase/auth';
import { setUserDetails } from "./context/actions/userActions";
import Dashboard from './components/Dashboard/Dashboard';


function App() {
  const firebaseAuth = getAuth(app);
  const dispatch = useDispatch();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(cred => {
      if(cred) {
          cred.getIdToken()
            .then(token => {
              validateUserJWTToken(token)
                  .then(data => {
                    dispatch(setUserDetails(data));
              });
          })
      }
  })
  }, [])
  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App
