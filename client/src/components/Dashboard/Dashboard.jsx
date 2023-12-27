import React, { useEffect } from 'react'
import AdminPanel from './AdminPanel'
import AdminArea from './AdminArea/AdminArea'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../../context/actions/userActions';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUserDetails(user));
    }
    else {
        navigate("/login", { replace: true })
    }
  }, [dispatch]);

  return (
    <div className='w-screen h-screen flex items-center bg-slate-200'>
      <AdminPanel />
      <AdminArea />
    </div>
  )
}
