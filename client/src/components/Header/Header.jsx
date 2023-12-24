import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Logo, Avatar } from '../../assets/index';
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setUserNull } from '../../context/actions/userActions'
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase.config';

export default function Header() {
    const location = useLocation();
    const user = useSelector((state) => state.user)
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function toggleDropdown() {
        setDropdownOpen(!isDropdownOpen);
    };
    function getStyle(isActive) {
        return isActive 
            ? 'text-xl text-yellow-950 font-semibold px-10 py-2' 
            : 'text-ls text-yellow-800 font-semibold px-10 py-2 hover:text-yellow-950 duration-100 transition-all ease-in-out';
      }

    function signOut() {
        firebaseAuth.signOut()
            .then(() => {
                dispatch(setUserNull());
                navigate('/login', {replace: true});
            })
            .catch((error) => console.error("Error!!: ", error));
    }
    
  return (
    <header className='fixed inset-x-0 z-10 top-0 flex items-center justify-between px-5 bg-transparent'>
        <NavLink to={'/'}>
            <img src={Logo} className='w-[280px]' alt='logo' />
        </NavLink>

        {/* Navlinks */}
        <nav className='flex items-center justify-center gap-7 mx-auto'>
            <ul className='hidden md:flex items-center justify-center gap-15'>
                <NavLink to={'/'} className={getStyle(location.pathname === '/')}>Home</NavLink>
                <NavLink to={'/customize'} className={getStyle(location.pathname === '/customize')}>Customize</NavLink>
                <NavLink to={'/aboutus'} className={getStyle(location.pathname === '/aboutus')}>About Us</NavLink>
            </ul>
        </nav>

        {user 
            ? <>
                <div className='flex flex-row items-center justify-center gap-5'>
                    {/* Cart */}
                    <div className='cursor-pointer relative'>
                        <FaCartArrowDown className='text-3xl text-yellow-950' />
                        <div className='w-5 h-5 rounded-full bg-yellow-500 absolute -top-3 -right-1 flex items-center justify-center'>
                            <p className='font-semibold text-sm text-yellow-950'>2</p>
                        </div>
                    </div>
                    {/* user selector dropdown */}
                    <div className='relative cursor-pointer w-12 h-12 rounded-full overflow-hidden hover:scale-110 transition-transform' onClick={toggleDropdown}>
                        <img 
                        className="w-full h-full object-cover"
                        src={user?.picture ? user?.picture : Avatar} 
                        alt='avatar' 
                        referrerPolicy = "no-referrer"
                        />
                    </div>
                </div>
                {isDropdownOpen && (
                    <div className='absolute top-full right-0 mt-2 bg-white border rounded-md shadow-md text-yellow-950 flex flex-col gap-2 px-4 py-2'>
                    {/* Dropdown content goes here */}
                        <Link className='hover:underline' to={'/dashboard/home'}>
                            Dashboard
                        </Link>
                        <Link  className='hover:underline' to={'/profile'}>
                            My Profile
                        </Link>
                        <div className='cursor-pointer hover:underline' onClick={signOut}>
                            Sign Out
                        </div>
                    </div>
                )}
            </>
            : <>
                <NavLink to={'/login'}>
                    <button className='px-4 py-2 rounded-md bg-yellow-950 border border-yellow-800 cursor-pointer'>
                        Login
                    </button>
                </NavLink>
            </>
        }

    </header>
  )
}
