import React from 'react'
import Header from './Header/Header';
import Home from './Home/Home';

export default function Main() {
  return (
    <main className='top-0 w-screen min-h-screen flex items-center justify-center flex-col bg-slate-200'>
        <Header /> 
        <Home />
    </main>
  );
}
