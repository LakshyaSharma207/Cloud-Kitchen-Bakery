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
    <main className='top-0 w-screen min-h-screen flex items-center justify-start flex-col' style={{backgroundImage: `url(${BgRepeat})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'repeat-y'}}> 
        <Header />
        <h2 className="text-3xl font-bold mb-4 text-center mt-20 text-yellow-950">Customize Your Cake</h2>
        <SharedStateProvider>
          <LeftOptions />
          <RightPreview />
        </SharedStateProvider>

        {cartState ? <CakeCart /> : ''}
    </main>
  );
};
