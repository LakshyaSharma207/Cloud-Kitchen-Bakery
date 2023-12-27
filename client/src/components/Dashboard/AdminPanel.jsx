import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo, Avatar } from '../../assets/index'
import { IoHomeSharp, IoList, IoLogOutOutline } from "react-icons/io5";
import { GiBubblingBowl } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { MdPlaylistAddCircle } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase.config';
import { setUserNull } from '../../context/actions/userActions';
import { persistor } from '../../main';

export default function AdminPanel() {
    const location = useLocation();
    const firebaseAuth = getAuth(app);
    const user = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function getStyle(isActive) {
        return isActive 
            ? 'flex flex-row items-center gap-5 text-2xl text-yellow-950 font-semibold px-10 py-2' 
            : 'flex flex-row items-center gap-5 text-xl text-yellow-800 font-semibold px-10 py-2 hover:text-yellow-950 duration-100 transition-all ease-in-out';
    }
    async function signOut() {
        try {
          await firebaseAuth.signOut();
          dispatch(setUserNull());
          // Clear local storage
          localStorage.removeItem('user');
          // Clear persisted state
          await persistor.purge();

          window.location.reload();
        } catch (error) {
          console.error('Error signing out:', error);
        }
    }  

    return (
    <div className='h-full py-12 flex flex-col bg-themeColor backdrop-blur-md shadow-md shadow-themeColor w-200 gap-3'>
      <NavLink to={'/'}>
            <img src={Logo} className='w-[280px]' alt='logo' />
        </NavLink>

        <ul className='flex flex-col gap-4'>
            <NavLink to={'/dashboard/home'} 
            className={getStyle(location.pathname === '/dashboard/home')}>
                <IoHomeSharp /> Home
            </NavLink>
            <NavLink to={'/dashboard/orders'} 
            className={getStyle(location.pathname === '/dashboard/orders')}>
                <IoList /> Orders
            </NavLink>
            <NavLink to={'/dashboard/ingredients'} 
            className={getStyle(location.pathname === '/dashboard/ingredients')}>
                <GiBubblingBowl /> Ingredients
            </NavLink>
            <NavLink to={'/dashboard/addnew'}
            className={getStyle(location.pathname === '/dashboard/addnew')}>
                <MdPlaylistAddCircle /> Add Ingredient
            </NavLink>
            <NavLink to={'/dashboard/users'} 
            className={getStyle(location.pathname === '/dashboard/users')}>
                <FaUsers /> Users
            </NavLink>
        </ul>

        <div className='w-full flex flex-col items-start px-12 mt-auto gap-7 justify-center'>
            <div className='relative cursor-pointer w-12 h-12 rounded-full flex items-center justify-center overflow-hidden hover:scale-125 transition-transform'>
                <img 
                className="w-full h-full object-cover"
                src={user?.photoURL ? user?.photoURL : Avatar} 
                alt='avatar' 
                onClick={() => navigate('/profile', {replace: true})}
                referrerPolicy = "no-referrer"
                />
            </div>
            <div>
                <button onClick={signOut} className='flex flex-row items-center justify-center gap-4 text-xl font-semibold text-yellow-950'>
                    <IoLogOutOutline /> Sign Out
                </button>
            </div>
        </div>
    </div>
  )
}
