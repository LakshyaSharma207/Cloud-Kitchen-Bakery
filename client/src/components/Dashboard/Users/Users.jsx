import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Avatar } from '../../../assets/index';
import { useSelector, useDispatch } from 'react-redux';
import { setAllUserDetails } from '../../../context/actions/allUserActions'
import { getAllUsers } from '../../../api';

export default function Users() {
  const allUsers = useSelector((state) => state.allUsers)
  const dispatch = useDispatch();

  useEffect(() => {
    if(!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, [])
  
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
            <TableCell align="center">Image</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Verification Status</TableCell>
            <TableCell align="center">Provider Data</TableCell>
            <TableCell align="center"></TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {allUsers &&
            allUsers.map((user) => (
              <TableRow key={user.uid}>
                <TableCell align="center"><div className='w-[65px] h-[65px] mx-auto'><img src={user.photoURL ? user.photoURL : Avatar}/></div></TableCell>
                <TableCell align="center">{user.displayName ? user.displayName : 'Unknown Person'}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">
                  <span className={`${!user.emailVerified ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </TableCell>
                <TableCell align="center">{user.providerData[0].providerId}</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
