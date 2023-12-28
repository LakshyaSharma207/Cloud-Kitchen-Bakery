import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { BgRepeat, Avatar } from '../../assets'
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../../config/firebase.config';
import { useNavigate } from 'react-router-dom';
import Forms from '../Login/Forms';
import { FaUserTag } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { setUserDetails } from '../../context/actions/userActions';
import CakeCart from '../CakeCart/CakeCart';

export default function Profile() {
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const db = getFirestore(app);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.isOpen)

  const [isClicked, setIsClicked] = useState(false);

  const changeDetails = async() => {
    setIsClicked(true);
    if (!newUsername && !newEmail && !newLocation) {
      console.log('Please enter at least one piece of information.');
      return;
    }
    try {
      await updateProfile(auth.currentUser, {
        displayName: newUsername || undefined,
        email: newEmail || undefined,
      });
      if(newLocation) updateLocation();
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    window.location.reload();
  }
  const updateLocation = async() => {
    const userId = user.uid;
    const userDocRef = doc(db, 'Users', userId);
    await setDoc(userDocRef, { location: newLocation })
  }
   
  useEffect(() => {
    const fetchPastOrders = async () => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'Users', userId);
        const cakeOrdersCollectionRef = collection(userDocRef, 'cakeOrders');
        const getData = [];
  
        try {
          const querySnapshot = await getDocs(cakeOrdersCollectionRef);
          const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((item) => item.hasOrdered);
  
          const userSnapshot = await getDoc(userDocRef);
          const userDetails = userSnapshot.data();
  
          getData.push({
            userDetails,
            orders: items,
          });
  
          setUserData(getData);
        } catch (err) {
          console.error('Error fetching orders: ', err);
        }
      } else {
        navigate("/login", { replace: true });
      }
    };
  
    fetchPastOrders();
  }, [user, db]);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUserDetails(user));
      } else {
        console.log('User signed out');
      }
    });
    return () => unsubscribe();
  }, [])

  return (
    <div className='top-0 w-screen min-h-screen flex items-center justify-start flex-col'> 
        <Header /> 
        <img 
        src={BgRepeat} 
        className='object-cover absolute top-0 left-0 min-h-screen h-full w-full bg-repeat-y'
        alt="background" 
        />
        <main className="flex flex-col h-full z-10 px-4 py-24 text-yellow-950 items-start justify-center gap-2">
          <h1 className='text-2xl font-semibold text-center px-2 pb-4'>User Profile</h1>
          <div className="flex flex-row items-center justify-start gap-5">
            <div className='w-28 h-28 border-2 border-yellow-950 rounded-full overflow-hidden shadow-md'>
              <img 
                className="object-cover w-full h-full"
                src={user?.photoURL ? user?.photoURL : Avatar} 
                alt='avatar' 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center flex flex-col items-start justify-center px-2">
              <h2 className="text-2xl font-semibold mb-2">{user?.displayName ? user?.displayName : 'Unknown Person'}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{userData.map((item, index) => (
                <span key={index}>{item.userDetails ? (
                    item.userDetails.location ? item.userDetails.location : 'location not set') : ('location not set')}
                </span>))}</p>
            </div>
            <button className={`bg-yellow-800 text-white rounded-md py-2 px-4 ml-14 hover:bg-yellow-950 focus:outline-none focus:ring transition ${isClicked ? 'animate-smoothClick' : ''}`} onClick={changeDetails} onAnimationEnd={() => setIsClicked(false)}>
              Save Details
            </button>
          </div>
          <div className="text-yellow-950 p-3 w-full rounded-md">
            <label className="block font-semibold my-2">Enter New Username:</label>
            <Forms 
                placeholder={"eg.JohnDoe"}
                inputState={newUsername}
                inputStateFunction={setNewUsername}
                type="text"
                icon={<FaUserTag className='text-2xl text-yellow-950 text-center'/>}
            />

            <label className="block font-semibold my-2">Enter New Email:</label>
            <Forms 
                placeholder={"eg.johndoe@user.com"}
                inputState={newEmail}
                inputStateFunction={setNewEmail}
                type="email"
                icon={<MdEmail className='text-2xl text-yellow-950 text-center'/>}
            />

            <label className="block font-semibold my-2">Enter New Location:</label>
            <Forms 
                placeholder={"eg.new delhi"}
                inputState={newLocation}
                inputStateFunction={setNewLocation}
                type="text"
                icon={<FaLocationDot className='text-2xl text-yellow-950 text-center'/>}
            />
            
          </div>
          <div className="flex flex-col items-start justify-center w-full">
            <h3 className="text-lg font-semibold mb-2">Order History</h3>
            <div className='flex flex-row gap-4 w-full'>
            {userData.map((item) => item.orders.map((order) => (
              <div key={order.id} className='border border-transparent bg-[#d5ab84] p-3 w-full rounded-md'>
                <div className="text-white font-semibold text-lg text-center">
                    <h3>{order.cakeName}</h3>
                    <p>{order.orderDate} Total: ${order.Price}</p>
                    <button className='bg-yellow-800 p-2 border border-yellow-800 rounded-lg hover:bg-yellow-950 text-sm mt-2'>Order Again!</button>
                </div>
              </div>
            )))}
            </div>
          </div>
        </main>
        {cartState ? <CakeCart /> : ''}
    </div>
  )
}
