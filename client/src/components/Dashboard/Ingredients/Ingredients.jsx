import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaCircleMinus } from "react-icons/fa6";
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app, storage } from '../../../config/firebase.config'
import { getFirestore } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export default function Ingredients() {
  const [data, setData] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Ingredients')); 
        const newData = [];
        
        querySnapshot.forEach((doc) => {
          newData.push({ 
            id: doc.id,
            icon: doc.data().icon,
            in_stock: doc.data().in_stock,
            name: doc.data().name,
            need_to_order: doc.data().need_to_order,
            price: doc.data().price,
            type: doc.data().type,
           });
        });

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    }
    fetchData();
  }, []);

  const valueDecrease = async (row) => {
    const documentRef = doc(db, "Ingredients", row.id);
    try {
      const docSnapshot = await getDoc(documentRef);
      const currentData = docSnapshot.data();
      let updatedData;

      if (currentData.in_stock > 0) {
        updatedData = {
          need_to_order: currentData.need_to_order + 1,
          in_stock: currentData.in_stock - 1,
        };
      } else {
        console.log("Cannot decrease further, in_stock is already 0.");
        return;
      }

      await updateDoc(documentRef, updatedData);
      setData((prevData) => prevData.map((item) => {
        if(item.id === row.id) {
          return {
            ...item,
            need_to_order: updatedData.need_to_order,
            in_stock: updatedData.in_stock,
          };
        }
        return item;}));
  
      console.log(`Document with ID ${row.id} updated successfully.`);
    } catch (err) {
      console.error("Error updating document: ", err);
    }
};

  const valueIncrease = async (row) => {
    const documentRef = doc(db, "Ingredients", row.id);
    try {
      const docSnapshot = await getDoc(documentRef);
      const currentData = docSnapshot.data();
      let updatedData;

      if (currentData.need_to_order <= 0) {
        console.log("Cannot increase further reached max in_stock");
      } else {
        updatedData = {
          need_to_order: currentData.need_to_order - 1,
          in_stock: currentData.in_stock + 1,
        };
      }
  
      await updateDoc(documentRef, updatedData);
      setData((prevData) => prevData.map((item) => {
        if(item.id === row.id) {
          return {
            ...item,
            need_to_order: updatedData.need_to_order,
            in_stock: updatedData.in_stock,
          };
        }
        return item;}));
  
      console.log(`Document with ID ${row.id} updated successfully.`);
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  }
  
  const deleteItem = async (row) => {
    try {
      // Delete image from Storage
      await deleteStorageImage(row.icon);

      // Delete from Firestore
      await deleteFirestoreData(row.id);

      setData((prevData) => prevData.filter((item) => item.id !== row.id));
    } catch (err) {
      console.error('Error deleting item: ', err);
    }
  };
  
  const deleteFirestoreData = async (itemId) => {
    try {
      const itemDocRef = doc(db, 'Ingredients', itemId);
      await deleteDoc(itemDocRef);
      console.log('Firestore document deleted successfully!');
    } catch (err) {
      console.error('Error deleting Firestore document: ', err);
    }
  };
  
  const deleteStorageImage = async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef).then(() => {
        console.log("Image deleted successfully!");
      }).catch((err) => {
        console.error('Error deleting Storage image: ', err);
      });
    } catch (err) {
      console.error('Error deleting Storage image: ', err);
    }
  };
 
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        width: '1000px', 
        position: 'fixed',
        top: '80px', 
        left: '360px',
        }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Icon</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Need To Order</TableCell>
            <TableCell align="center">In Stock</TableCell>
            <TableCell align="center"></TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center"><div className='w-[65px] h-[65px] mx-auto'><img src={row.icon}/></div></TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">${row.price}</TableCell>
              <TableCell align="center">{row.need_to_order}kg</TableCell>
              <TableCell align="center"><div className='flex flex-row items-center justify-center gap-4'>
                <FaCircleMinus 
                  className='text-yellow-950 text-xl cursor-pointer' 
                  onClick={() => valueDecrease(row)} />
                  {row.in_stock}kg</div>
              </TableCell> 
              <TableCell align="center"><div className='flex flex-row justify-center items-center gap-3'>
                <RiDeleteBin2Fill onClick={() => deleteItem(row)} className='text-red-500 text-3xl cursor-pointer'/>
                {row.name !== 0 ? <div className='flex items-center text-green-600 font-semibold justify-center cursor-pointer' onClick={() => valueIncrease(row)}>
                  Order More<MdKeyboardDoubleArrowRight className='scale-150'/>
                  </div> : <div className='text-red-700 flex items-center justify-center cursor-pointer font-semibold' onClick={() => valueIncrease(row)}>Low Stock!!</div>}
              </div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
