import { BgRepeat } from '../../assets';
import Header from '../Header/Header'
import React from 'react';
import LeftOptions from './LeftOptions/LeftOptions';
import RightPreview from './RightPreview/RightPreview';
import { SharedStateProvider } from './SharedStateContext';

export default function Customize() {
  return (
    <main className='top-0 w-screen min-h-screen flex items-center justify-start flex-col' style={{backgroundImage: `url(${BgRepeat})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'repeat-y'}}> 
        <Header />
        <h2 className="text-3xl font-bold mb-4 text-center mt-20 text-yellow-950">Customize Your Cake</h2>
        <SharedStateProvider>
          <LeftOptions />
          <RightPreview />
        </SharedStateProvider>
    </main>
  );
};
