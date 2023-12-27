import React, { useEffect, useState } from 'react';
import { useSharedState } from '../SharedStateContext';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../../../config/firebase.config'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { setCartState } from '../../../context/actions/cartAction';

export default function RightPreview() {
  const [cakeName, setCakeName] = useState('');
  const [checkFields, setCheckFields] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const { sharedState, setSharedState } = useSharedState();
  const user = useSelector((state) => state.user);
  const db = getFirestore(app);
  const dispatch = useDispatch();
    
  async function sendToCart() {
    setIsClicked(true);
    if (!user) {
      console.error('User not authenticated.');
      setCheckFields('Please Login First.')
      return;
    }
    if(!cakeName || !sharedState.selectedSize || !sharedState.selectedType || !sharedState.selectedFlour || !sharedState.selectedSweetner || !sharedState.selectedFillings || !sharedState.selectedToppings) {
      setCheckFields('Please Enter All required details!');
      return;
    } else {
      const userId = user.uid;
      const cakeOrder = {
        cakeName: cakeName,
        Type: sharedState.selectedType,
        Size: sharedState.selectedSize,
        Flour: sharedState.selectedFlour,
        Toppings: sharedState.selectedToppings,
        Fillings: sharedState.selectedFillings,
        Sweetner: sharedState.selectedSweetner,
        Price: sharedState.selectedPrice,
        orderDate: new Date().toLocaleDateString(),
        hasOrdered: false,
        payment: 'none',
      };

      const userDocRef = doc(db, 'Users', userId);
      let username;
      if(user?.displayName) {username = user.displayName;}
      else {username = 'Unknown Person';}
      await setDoc(userDocRef, { userName: username })
      const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders');

      try {
        const docRef = await addDoc(cakeOrdersCollectionRef, cakeOrder);
        console.log('Cake order added with ID: ', docRef.id);
        const initialState = {
          selectedType: '',
          selectedSize: '',
          selectedFlour: '',
          selectedToppings: [],
          selectedFillings: [],
          selectedSweetner: '',
          selectedPrice: 0,
        };        
        setSharedState(initialState);
        setCakeName('');
        dispatch(setCartState());
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
      <div>
        <p className="text-lg font-semibold">Selected Flour: <span className='text-yellow-950'>{sharedState.selectedFlour}</span></p>
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
        <input type="text" className="text-base font-semibold bg-white text-black" placeholder="Your Creation's Name" onChange={(e) => setCakeName(e.target.value)} /> 
        <p className="text-lg font-semibold">Total Price: ${sharedState.selectedPrice}</p>
        <button className={`${isClicked && "animate-smoothClick"} bg-green-600 text-white px-4 py-2 rounded transition-all hover:bg-green-700`} onClick={sendToCart} onAnimationEnd={() => setIsClicked(false)}>Add to Cart</button>
        {checkFields ? <p className='text-semibold text-red-600'>{checkFields}</p> : ''}
      </div>
    </div>
  );
}
