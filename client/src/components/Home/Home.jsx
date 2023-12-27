import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Customize from '../Customize/Customize';
import SuccessFul from '../CakeCart/SuccessFull/SuccessFul';

export default function Home() {
  return (
    <>
    <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/customize' element={<Customize />}/>
        <Route path='/aboutus' element={<LandingPage />}/>
        <Route path='/ordersuccess' element={<SuccessFul />} />
      </Routes>
    </>
  )
}
