import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { app, storage } from '../../../config/firebase.config'; 
import { MdPlaylistAddCircle } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddNewItem() {
  const [itemName, setName] = useState('');
  const [itemQuantity, setQuantity] = useState(0);
  const [itemType, setType] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [itemURL, setURL] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const db = getFirestore(app)
  
  function handleTypeSelection(type) {
    setType(type);
  }
  function toggleStyle(e) {
    e.target.classList.toggle('bg-yellow-950');
  }
  
  const handleImageUpload = async () => {
    if (!itemImage) {
      console.error('Please select an image.');
      return;
    }

    const storageRef = ref(storage, `ingredients/${itemImage.name}`);

    try {
      await uploadBytes(storageRef, itemImage);

      // Get download URL
      const imageUrl = await getDownloadURL(storageRef);
      setURL(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const handleAddItem = async () => {
    try {
      if (!itemName || itemQuantity === 0 || !itemType || !itemImage) {
        console.error('Please provide item name, type, image and quantity.');
        return;
      }
      const collectionRef = collection(db, 'Ingredients');  
      const docRef = await addDoc(collectionRef, {
        name: itemName,
        in_stock: parseInt(itemQuantity, 10),
        need_to_order: 0,
        type: itemType,
        price: parseInt(itemPrice, 10),
        icon: itemURL, 
      });
      console.log('Document added with ID: ', docRef.id);
      const newDocId = docRef.id;
      // Updates the document to include the ID
      const updatedDocRef = doc(collectionRef, newDocId);
      await updateDoc(updatedDocRef, { id: newDocId });
  
      setName('');
      setQuantity(0);
      setType('');
      setURL('');
      setItemPrice(0)
      setItemImage(null);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col px-7 md:px-24 w-full mt-2">
      <h2 className="text-yellow-950 text-2xl font-bold mb-4">Add New Ingredient</h2>
      <label className="mb-2">
        <span className="block text-sm text-gray-600">Ingredient Name:</span>
        <input
          type="text"
          className="w-full border rounded-md py-2 px-5 text-black bg-white focus:outline-none focus:border-yellow-950"
          value={itemName}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="mb-4">
        <span className="block text-sm text-gray-600">Required Quantity:</span>
        <input
          type="number"
          className="w-full border rounded-md py-2 px-5 text-black bg-white focus:outline-none focus:border-yellow-950"
          value={itemQuantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <label className="mb-4">
        <span className="block text-sm text-gray-600">Price:</span>
        <input
          type="number"
          className="w-full border rounded-md py-2 px-5 text-black bg-white focus:outline-none focus:border-yellow-950"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </label>
      <label className="mb-4">
  <span className="block text-sm text-gray-600 mb-2">Type:</span>
  <div className="border border-gray-300 p-5 rounded-md bg-slate-300">
    <div className="flex space-x-2 px-3">
      <button
        className="bg-yellow-800 text-white py-2 px-5 rounded-md border-2 border-yellow-800 transition-colors focus:bg-yellow-900 focus:outline-none focus:border-white"
        onMouseEnter={ (e) => toggleStyle(e) }
        onMouseLeave={ (e) => toggleStyle(e) }
        onClick={() => handleTypeSelection('Sweetner')}
      >
        Sweetner
      </button>
      <button
        className="bg-yellow-800 text-white py-2 px-5 rounded-md border-2 border-yellow-800 transition-colors focus:bg-yellow-900 focus:outline-none focus:border-white"
        onMouseEnter={ (e) => toggleStyle(e) }
        onMouseLeave={ (e) => toggleStyle(e) }
        onClick={() => handleTypeSelection('Flour')}
      >
        Flour
      </button>
      <button
        className="bg-yellow-800 text-white py-2 px-5 rounded-md border-2 border-yellow-800 transition-colors focus:bg-yellow-900 focus:outline-none focus:border-white"
        onMouseEnter={ (e) => toggleStyle(e) }
        onMouseLeave={ (e) => toggleStyle(e) }
        onClick={() => handleTypeSelection('Filling')}
      >
        Filling
      </button>
      <button
        className="bg-yellow-800 text-white py-2 px-5 rounded-md border-2 border-yellow-800 transition-colors focus:bg-yellow-900 focus:outline-none focus:border-white"
        onMouseEnter={ (e) => toggleStyle(e) }
        onMouseLeave={ (e) => toggleStyle(e) }
        onClick={() => handleTypeSelection('Topping')}
      >
        Topping
      </button>
      </div>
    </div>
  </label>
  <label className='mb-4'>
    <span className='block text-sm text-gray-600 mb-2'>Upload Image:</span>
    <div className='flex flex-row items-center gap-4'>
      <div className={`relative border-dashed border-2 w-[370px] h-[100px] ${itemImage ? 'border-green-500' : 'border-gray-300'} p-5 rounded-md bg-slate-300 mb-2 w-full`}>
        <input
          type="file"
          onChange={(e) => setItemImage(e.target.files[0])}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div className="text-center">
          <p className={`text-sm ${itemImage ? 'text-green-500' : 'text-gray-500'}`}>{itemImage ? 'File selected! Click Upload now.' : 'Drag and drop or click to select a file'}</p>
        </div>
      </div>
      <button
        onClick={handleImageUpload}
        className={`text-white py-2 px-5 rounded-md border-2 border-yellow-800 hover:bg-yellow-950 focus:border-white transition-colors ${itemURL ? 'bg-green-600' : 'bg-yellow-800'}`}
      >
        {itemURL ? 'Uploaded' : 'Upload'} 
      </button>
    </div>
  </label>
    <button
      className="bg-yellow-800 text-white py-2 px-5 rounded-md flex flex-row gap-2 border-1 border-yellow-800 hover:bg-yellow-950 focus:outline-none focus:border-white"
      onClick={handleAddItem}
    >
      Add Ingredient <MdPlaylistAddCircle className='text-2xl' />
    </button>
  <p className='text-gray-500 px-2 py-4 text-sm'>Hint: Click Add Ingredient to update database</p>
  </div>
  )
}
