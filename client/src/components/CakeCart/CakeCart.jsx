import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCartState } from '../../context/actions/cartAction'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { tempCake } from '../../assets/index';
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { app } from '../../config/firebase.config';
import { useNavigate } from 'react-router-dom';

export default function CakeCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openDetails, setOpenDetails] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const db = getFirestore(app);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.isOpen);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'Users', userId);
        const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders');

        try {
          const querySnapshot = await getDocs(cakeOrdersCollectionRef);
          const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((item) => !item.hasOrdered);

          setCartItems(items);
          const sumPrice = items.reduce((total, item) => total + parseFloat(item.Price), 0);
          setTotalPrice(sumPrice);
          console.log(items);
        } catch (err) {
          console.error('Error fetching cart items: ', err);
        }
      }
    };

    if (cartState) {
      fetchCartItems();
    }
  }, [cartState, user, db]);

  function toggleDetails(itemId) {
    setOpenDetails((prevOpenDetails) => ({
      ...prevOpenDetails,
      [itemId]: !prevOpenDetails[itemId],
    }));
  };  

  const checkOut = async () => {
    setIsClicked(true);
    if(!selectedPaymentMethod) {
      console.error("Select Payment Method and Try again");
      return;
    }
    const userId = user.uid;
    const userDocRef = doc(db, 'Users', userId);
    const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders'); 
    // updateIngredientsCollection();
  
    try {
      for (const item of cartItems) {
        const itemDocRef = doc(cakeOrdersCollectionRef, item.id);
        await updateDoc(itemDocRef, { hasOrdered: true, payment: selectedPaymentMethod });
        setCartItems((prevState) => {
          return prevState.map((item) => item.hasOrdered ? item : { ...item, hasOrdered: true, payment: selectedPaymentMethod });
        });
      }
      navigate("/ordersuccess", { replace: true });
    } catch (error) {
      console.error('Error checking out:', error);
    }
  }

  const deleteItem = async (itemId) => {
      const userId = user.uid;
      const userDocRef = doc(db, 'Users', userId);
      const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders');
      try {
        const itemDocRef = doc(cakeOrdersCollectionRef, itemId);
        await deleteDoc(itemDocRef);
        console.log(`Cake order with ID ${itemId} deleted successfully.`);
        setCartItems((prevState) => {
          return prevState.filter((item) => item.id !== itemId);
        });        
    } catch(err){
      console.error('Error deleting Firestore document: ', err);
    }
  }

  // const updateIngredientsCollection = async (cartItems) => {
  //   try {
  //     for (const item of cartItems) {
  //       await updateIngredient('Toppings', item.Toppings);
  
  //       await updateIngredient('Fillings', item.Fillings);
  
  //       await updateIngredient('Sweetener', item.Sweetner);
  
  //       await updateIngredient('Flour', item.Flour);
  //     }
  
  //     console.log('Ingredients collection updated successfully.');
  //   } catch (error) {
  //     console.error('Error updating Ingredients collection:', error);
  //   }
  // };
  
  // // Helper function to update a specific ingredient
  // const updateIngredient = async (ingredientType, names) => {
  //   try {
  //     for (const name of names) {
  //       const ingredientDocRef = doc(db, 'Ingredients');
  //       const ingredientSnapshot = await getDoc(ingredientsCollectionRef.where('name', '==', name));
  //       const currentInStock = ingredientSnapshot.data().in_stock;
  //       const needToOrder = ingredientSnapshot.data().need_to_order;
  //       const stockChange = currentInStock - 1;
  //       const needChange = needToOrder + 1;
  
  //       // Update the field you want in the 'Ingredients' document
  //       await updateDoc(ingredientDocRef, { in_stock: stockChange, need_to_order: needChange });
  //     }
  //   } catch (error) {
  //     console.error(`Error updating ${ingredientType} ingredient:`, error);
  //   }
  // };  
    
  return (
    <div
    className={`fixed top-0 right-0 h-full bg-[#f0d7c0d9] shadow-md w-350 md:w-508 overflow-y-auto transition-all duration-300 ease-out ${
      cartState ? 'translate-x-0' : 'translate-x-full'
    } z-20`}
  >
    {/* Cart header */}
    <div className="p-4 border-b border-yellow-950 flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-yellow-950">Shopping Cart</h2>
      <button className="text-gray-500" onClick={() => dispatch(setCartState())}>
        <IoIosArrowDroprightCircle className='text-yellow-950 text-3xl' />
      </button>
    </div>

    {/* Cart items */}
    <div className="p-4">
      {cartItems.length === 0 ? (
        <p className='text-yellow-950 font-semibold text-xl text-center'>Your cart is empty.</p>
      ) : ( 
        <div className='flex flex-col items-center justify-center gap-5'> 
          {cartItems.map((item) => (
            <div key={item.id} className='border border-transparent bg-[#d5ab84] p-3 w-full rounded-md'>
            <div className="flex justify-between items-center text-white font-semibold text-lg">
              <div className='h-14 overflow-hidden'>
                <img 
                  className="h-full object-cover"
                  src={tempCake} 
                  alt='cake image' 
                />
              </div>
              <h3>{item.cakeName}</h3><p>${item.Price}</p>
              <RiDeleteBin2Fill className='text-3xl cursor-pointer text-red-600 animate-smoothClick transition-all' onClick={() => deleteItem(item.id)} />
              <button className='cursor-pointer' onClick={() => toggleDetails(item.id)}>Details</button>
            </div>
            {openDetails[item.id] && (
              <div className="mt-2 font-medium">
                <p>Size: {item.Size}</p>
                <p>Type: {item.Type}</p>
                <p>Flour: {item.Flour}</p>
                <p>Toppings: {item.Toppings.join(', ')}</p>
                <p>Fillings: {item.Fillings.join(', ')}</p>
                <p>Sweetener: {item.Sweetner}</p>
              </div>
            )}
            </div>
          ))}
          {/* Cart final info */}
          <div className='w-[80%] flex flex-col items-center justify-center absolute bottom-5 gap-4'>
            <p className='text-xl text-yellow-950 font-semibold'>Total: ${totalPrice}</p>
            <div className='flex'>
              <label className="block text-base font-medium text-yellow-950">
                Payment Method:
              </label>
              <select
                id="paymentOptions"
                name="paymentOptions"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="block w-[50%]] p-2 bg-white text-black rounded-md focus:outline-none focus:ring"
              >
                <option value='' disabled>
                  Choose a payment option
                </option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash on Delivery</option>
              </select>
            </div>
            <button className={`${isClicked && "animate-smoothClick"} bg-yellow-800 hover:bg-yellow-950 border rounded-md border-yellow-800 hover:scale-105 p-3 w-full transition-all`} onClick={checkOut} onAnimationEnd={() => setIsClicked(false)}>Check Out</button>
          </div>
        </div>
      )}
    </div>
  </div>
  )
}
