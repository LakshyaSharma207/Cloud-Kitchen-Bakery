import React, { useEffect, useState } from 'react';
import { useSharedState } from '../SharedStateContext';
import { useSelector } from 'react-redux';
import { app } from '../../../config/firebase.config'
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore'

export default function RightPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [cakeName, setCakeName] = useState('');
  const [checkFields, setCheckFields] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const { sharedState } = useSharedState();
  const user = useSelector((state) => state.user);
  const db = getFirestore(app);
    
  async function sendToCart() {
    setIsClicked(true);
    if (!user) {
      console.error('User not authenticated.');
      setCheckFields('Please Login First.')
      return;
    }
    if(!cakeName || !sharedState.selectedSize || !sharedState.selectedType || !sharedState.selectedSweetner || !sharedState.selectedFillings || !sharedState.selectedToppings) {
      setCheckFields('Please Enter All required details!');
      return;
    } else {
      const userId = user.uid;
      const cakeOrder = {
        cakeName: cakeName,
        Type: sharedState.selectedType,
        Size: sharedState.selectedSize,
        Toppings: sharedState.selectedToppings,
        Fillings: sharedState.selectedFillings,
        Sweetner: sharedState.selectedSweetner,
        Price: sharedState.selectedPrice,
        hasOrdered: false,
      };

      const userDocRef = doc(db, 'Users', userId);

      const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders');

      try {
        const docRef = await addDoc(cakeOrdersCollectionRef, cakeOrder);
        console.log('Cake order added with ID: ', docRef.id);
        setIsOpen(true);
      } catch (error) {
        console.error('Error adding cake order: ', error);
      }
    }
  }
  useEffect(() => {
      console.log("price", sharedState.selectedPrice)
      setCheckFields(false);
    }, [sharedState.selectedPrice, cakeName]);

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
      <div className="my-4 flex flex-col gap-4 items-start">
        <input type="text" className="text-base font-semibold bg-white text-black" placeholder="You're Creation's Name" onChange={(e) => setCakeName(e.target.value)} /> 
        <p className="text-lg font-semibold">Total Price: ${sharedState.selectedPrice}</p>
        <button className={`${isClicked && "animate-smoothClick"} bg-green-600 text-white px-4 py-2 rounded transition-all hover:bg-green-700`} onClick={sendToCart} onAnimationEnd={() => setIsClicked(false)}>Add to Cart</button>
        {checkFields ? <p className='text-semibold text-red-600'>{checkFields}</p> : ''}
      </div>
    </div>
  );
}
