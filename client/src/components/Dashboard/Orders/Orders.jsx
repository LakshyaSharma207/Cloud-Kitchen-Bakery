import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../../config/firebase.config';

export default function Orders() {
  const db = getFirestore(app);
  const [allUsersWithOrders, setAllUsersWithOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try{
        const usersCollectionRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const usersData = [];
        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          const cakeOrdersCollectionRef = collection(usersCollectionRef, userId, 'cakeOrders');
          const cakeOrdersSnapshot = await getDocs(cakeOrdersCollectionRef);

          const cakeOrdersData = cakeOrdersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          usersData.push({
            userData,
            cakeOrders: cakeOrdersData,
          });
        }
        console.log(usersData);
        setAllUsersWithOrders(usersData);
      } catch (error) {
        console.error('Error fetching users with orders:', error);
      }
    };
    fetchOrders();
  }, [db]);

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
            <TableCell align="center">Order Id</TableCell>
            <TableCell align="center">Order Name</TableCell>
            <TableCell align="center">User Name</TableCell>
            <TableCell align="center">Total Amount</TableCell>
            <TableCell align="center">Payment</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center"></TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {allUsersWithOrders.map((user) => user.cakeOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell align="center">{order.id}</TableCell>
              <TableCell align="center">{order.cakeName}</TableCell>
              <TableCell align="center">{user.userData.userName}</TableCell>
              <TableCell align="center">${order.Price}</TableCell>
              <TableCell align="center">{order.payment}</TableCell>
              <TableCell align="center">{order.orderDate}</TableCell>
              <TableCell align="center">{order.hasOrdered ? 'Delivered' : 'In-Process'}</TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
