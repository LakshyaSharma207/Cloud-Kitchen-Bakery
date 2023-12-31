import { BgRepeat } from '../../assets';
import Header from '../Header/Header'
import React from 'react';
import LeftOptions from './LeftOptions/LeftOptions';
import RightPreview from './RightPreview/RightPreview';
import { SharedStateProvider } from './SharedStateContext';
import CakeCart from '../CakeCart/CakeCart';
import { useSelector } from 'react-redux';

export default function Customize() {
  const cartState = useSelector((state) => state.cart.isOpen)

  return (
    <main className='w-full h-full flex items-center justify-start flex-col'> 
      <img 
        src={BgRepeat} 
        className='object-cover fixed top-0 left-0 bg-repeat-y'
        alt="background" 
        />
      <h2 className="text-3xl font-bold mb-4 text-center mt-20 z-10 text-yellow-950">Customize Your Cake</h2>
      <SharedStateProvider>
        <LeftOptions />
        <RightPreview />
      </SharedStateProvider>

      {cartState ? <CakeCart /> : ''}
    </main>
  );
};
