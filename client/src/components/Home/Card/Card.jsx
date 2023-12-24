import React from 'react';

export default function Card({ image, title, desc }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
      <img className="w-full h-full object-cover object-center" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-2xl mb-2 text-yellow-950">{title}</div>
        <p className="text-gray-700 text-xl">{desc}</p>
      </div>
    </div>
  );
}
