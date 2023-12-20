import React from 'react'
import AdminPanel from './AdminPanel'
import AdminArea from './AdminArea/AdminArea'

export default function Dashboard() {
  return (
    <div className='w-screen h-screen flex items-center bg-slate-200'>
      <AdminPanel />
      <AdminArea />
    </div>
  )
}
