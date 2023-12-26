import React from 'react'
import Header from './Header/Header';
import Home from './Home/Home';
import { useSelector } from 'react-redux';
import CakeCart from './CakeCart/CakeCart';

export default function Main() {
  const cartState = useSelector((state) => state.cart.isOpen)

  return (
    <main className='top-0 w-screen min-h-screen flex items-center justify-start flex-col'> 
        <Header /> 
        <Home /> 

        {cartState ? <CakeCart /> : ''}
    </main> 
  );
}
