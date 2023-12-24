import React from 'react';

export default function Selection({ items, selectedItems, handleSelectionChange, title }) {
  
  return (
    <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex">
        {items.map((item) => (
            <button
            key={item}
            className={`mr-4 px-4 py-2 ${
                selectedItems.includes(item) ? 'bg-yellow-800 text-white' : 'bg-yellow-50'
            } rounded-md focus:outline-none focus:border-black`}
            onClick={() => handleSelectionChange(item)}
            >
            {item}
            </button>
        ))}
        </div>
    </div>
    );
}
