import React from 'react';
import { BgRepeat } from '../../../assets/index'

export default function SuccessFul() {
  return (
    <div className='top-0 w-screen min-h-screen flex items-center justify-center text-yellow-950 font-bold' style={{ backgroundImage: `url(${BgRepeat})`, backgroundRepeat: 'repeat-y', backgroundSize: 'cover' }}>
      Your Order was Successful
    </div>
  )
}
