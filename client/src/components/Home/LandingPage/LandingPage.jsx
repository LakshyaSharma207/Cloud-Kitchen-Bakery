import React, { useState } from 'react'
import { HomeBg, BgRepeat, jackDaniel, carrotCake, veganCake, bakers } from '../../../assets/index'
import Card from '../Card/Card'; 
import Carrers from '../Carrers/Carrers';
import { FaGithub } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className='flex flex-col w-full justify-start items-center'>
      <div className='w-full p-8 mx-auto space-y-12' style={{backgroundImage: `url(${HomeBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <h1 className='text-4xl font-bold mt-14 text-yellow-950 ml-[60%]'>Sweet Tooth</h1>
        <p className='text-gray-700 max-w-2xl ml-[60%] font-bold'>
          Sweet Tooth is a cloud kitchen bakery that caters to health-conscious individuals, offering high customizations and a variety of delightful treats. Indulge in our scrumptious offerings made with love and the healthy ingredients.
        </p>
        <p className='text-gray-700 max-w-2xl ml-[60%] font-bold'>
          Our motto in Sweet Tooth is to bake a cake for everyone, thus it values inclusivity over everything.
        </p>
        <div className='ml-[60%] pt-5'>
          <button className='bg-yellow-800 text-white px-6 py-3 rounded-full hover:bg-yellow-950 hover:scale-105'>
            Order Now
          </button>
        </div>
      </div>
      <div className='w-full p-5 mx-auto space-y-1' style={{backgroundImage: `url(${BgRepeat})`, backgroundRepeat: 'repeat-y', backgroundSize: 'cover'}}>
      <h2 className='text-yellow-950 font-semibold text-3xl text-center py-12'>Our Highlights - </h2>
        <div className='flex flex-row items-start justify-center gap-12'>
          <Card image={jackDaniel} title={"Jack Daniel's Custom Cake"} desc={"Made for Beer Lovers, perfect for birthday celebrations."} />
          <Card image={carrotCake} title={"Carrot Cake"} desc={"Delicious cake which is healthy and full of crunchy nuts. Specially made for Carrot Lovers"}/>
          <Card image={veganCake} title={"Nuts-Free Vegan Fruit Cake"} desc={"Nuts-Free Vegan cake made with coconut cream (its not a nut despite name) for people with nut allergies."}/>
        {/* Free Images from Adobe */}
        </div>
      </div>
      <div className='w-full mx-auto space-y-1 text-center' style={{backgroundImage: `url(${BgRepeat})`, backgroundRepeat: 'repeat-y', backgroundSize: 'cover'}}>
        <Carrers image={bakers} positions={{ 'Cake Baker': 'positions open!',
                                             'Delivery Worker': 'positions open!', 
                                             'Allergy Specialist': 'positions open!',
                                             'Database Manager': 'Coming Soon!' }} />
      <footer className="text-yellow-950 px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p>&copy; 2023 Sweet Tooth. All rights reserved.</p>
        </div>
        <a
          href="https://github.com/LakshyaSharma207/Cloud-Kitchen-Bakery"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700 ml-2 flex items-center gap-2"
        >
        <FaGithub className='text-2xl' />
        GitHub
        </a>
      </footer>
      </div>
    </div>
  );
};