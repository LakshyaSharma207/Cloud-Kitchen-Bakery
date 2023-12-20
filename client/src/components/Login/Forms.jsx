import React, { useState } from 'react';

export default function Forms({ placeholder, inputState, inputStateFunction, type, icon }) {
    const [isClicked, setIsClicked] = useState(false);
    
    return (
        <div className={`transition-transform transform ${isClicked ? 'scale-105 shadow-lg' : 'scale-100'} flex item-center justify-center gap-4 bg-themeColor backdrop-blur-md rounded-md w-full px-4 py-2`}>
        {icon}
        <input 
            type={type} 
            placeholder={placeholder} 
            className='w-full h-full bg-transparent text-slate-900 text-lg font-semibold border-none outline-none'
            value={inputState}
            onChange={(e) => inputStateFunction(e.target.value)}
            onFocus={() => setIsClicked(true)}
            onBlur={() => setIsClicked(false)}
            />
        </div>
    );
}
