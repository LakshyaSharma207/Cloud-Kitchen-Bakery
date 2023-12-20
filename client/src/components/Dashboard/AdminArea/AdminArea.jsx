import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminHome from '../AdminHome/AdminHome'
import Orders from '../Orders/Orders'
import Ingredients from '../Ingredients/Ingredients'
import Users from '../Users/Users'
import AddNewItem from '../AddNew/AddNewItem'

export default function AdminArea() {
  return (
    <div className='flex flex-col flex-1 overflow-y-scroll'>
      <Routes>
        <Route path='/home' element={<AdminHome />}/>
        <Route path='/orders' element={<Orders />}/>
        <Route path='/ingredients' element={<Ingredients />}/>
        <Route path='/addnew' element={<AddNewItem />}/>
        <Route path='/users' element={<Users />}/>
      </Routes>
    </div>
  )
}
