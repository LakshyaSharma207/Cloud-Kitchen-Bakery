import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Paper from '@mui/material/Paper';

export default function DataBox({ context, total, icon, dataset }) {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
          return (
            <div style={{ backgroundColor: 'white', padding: '5px' }}>
              <p>{`${Object.keys(dataset[0])[0]}: ${label}`}</p>
              <p>{`${Object.keys(dataset[0])[1]}: ${payload[0].value}`}</p>
            </div>
          );
        }
      
        return null;
      };
  
    return (
    <Box
        sx={{
          width: 500,
          height: 200,
          p: 3,
          boxShadow: 2,
          borderRadius: 2,
          textAlign: 'left',
          color: '#422006',
          backgroundColor: 'white',
          marginRight: 16, 
          position: 'relative'
        }}
      >
        <Typography variant="h3"><div className='bg-slate-200 border rounded-full px-2 py-2 inline-block'>{icon}</div></Typography>
        <Typography variant="h4">{total}</Typography>
        <Typography variant="h6">{context}</Typography>

        {/* Graph on the right side */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%' }}>
        <Paper style={{ padding: '16px', height: '100%', border: 'none' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataset}>
              <XAxis dataKey={Object.keys(dataset[0])[0]} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey={Object.keys(dataset[0])[1]} stroke="#4CAF50" strokeWidth={2} dot={{ fill: '#4CAF50' }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        </div>
      </Box>
  )
}
