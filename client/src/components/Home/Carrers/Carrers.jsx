import React, { useState } from 'react'

export default function Carrers({ image, positions }) {
    const [displayConfirm, setDisplayConfirm] = useState(false);
    
  return (
    <>
    <h3 className='text-yellow-950 font-semibold text-3xl py-12 px-5'>CARRER WITH US</h3>
    <div className="relative">
        <img className="w-full scale" src={image} alt="Blurred Background" />
        <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)', 
        }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-950 text-2xl max-w-[960px] mx-auto">
        Due to being a new bakery, we are short on staff and will love to have you in our team. To join us send your email in below form.
        </div>
    </div>
    <div className='flex flex-row items-center justify-center gap-28 py-10 px-5'>
    {Object.entries(positions).map(([pos, status]) => (
        <div className='flex flex-col items-center justify-center gap-2 p-2' key={pos}>
            <h4 className='font-semibold text-2xl text-yellow-950'>{pos}</h4>
            <p className='text-base text-gray-700 font-medium hover:underline cursor-pointer'>{status}</p>
        </div>
    ))}
    </div>
    <form className="flex items-center justify-center gap-4">
        <input
        type="email"
        className="border text-black border-gray-300 rounded p-4 w-96 focus:outline-none cursor-text h-12"
        placeholder="Enter email"
        />
        <button
        type="submit"
        className="bg-yellow-800 text-white rounded-lg p-3 focus:outline-none hover:bg-yellow-950 h-12 text-center"
        onClick={(event) => {
            event.preventDefault();
            setDisplayConfirm(true);}}
        >
        Apply Now
        </button>
        {displayConfirm ? <p className='text-red-700 font-semibold'>Email Sent!!</p> : ''}
    </form>
    </>
  )
}
