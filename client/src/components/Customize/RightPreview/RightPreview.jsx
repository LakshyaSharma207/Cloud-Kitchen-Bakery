import React, { useEffect } from 'react';
import { useSharedState } from '../SharedStateContext';

export default function RightPreview() {
    const { sharedState } = useSharedState();
    useEffect(() => {
        console.log("price", sharedState.selectedPrice)
      }, [sharedState.selectedPrice]);

  return (
    <div className="p-8 rounded-md fixed top-36 right-44 text-yellow-800 w-96 flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-yellow-950">Cake Information</h2>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Selected Type: <span className='text-yellow-950'>{sharedState.selectedType}</span></p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Selected Size: <span className='text-yellow-950'>{sharedState.selectedSize}</span></p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Selected Toppings: <span className='text-yellow-950'>{sharedState.selectedToppings.join(', ')}</span></p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Selected Fillings: <span className='text-yellow-950'>{sharedState.selectedFillings.join(', ')}</span></p>
      </div>
      <div>
        <p className="text-lg font-semibold">Selected Sweetner: <span className='text-yellow-950'>{sharedState.selectedSweetner}</span></p>
      </div>
      <div className="my-4 flex flex-row gap-4 items-center justify-start">
        <p className="text-lg font-semibold">Total Price: ${sharedState.selectedPrice}</p><button className="bg-green-600 text-white px-4 py-2 rounded">Order Now</button>
      </div>
    </div>
  );
}
