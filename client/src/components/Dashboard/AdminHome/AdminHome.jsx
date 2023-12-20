import React from 'react';
import { HiUsers } from "react-icons/hi2";
import { FaSuitcase } from "react-icons/fa6";
import DataBox from './DataBox';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export default function AdminHome() {
  const customerdata = [
    { name: 'Jan', customers: 10 },
    { name: 'Feb', customers: 23 },
    { name: 'Mar', customers: 37 },
    { name: 'Apr', customers: 78 },
    { name: 'May', customers: 100 },
  ];
  const piedata = [
    { name: 'Pineapple', value: 30 },
    { name: 'Almond Flour', value: 25 },
    { name: 'Black Chocolate', value: 20 },
    { name: 'Carrot', value: 15 },
    { name: 'Greek Yogurt', value: 10 },
  ];
  const orderdata = [
    { month: 'January', value: 50 },
    { month: 'February', value: 80 },
    { month: 'March', value: 120 },
    { month: 'April', value: 200 },
    { month: 'May', value: 220 },
  ];
  
  const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <p className='z-10 text-black'><b>{`${payload[0].name}`}</b></p>
          <p className='text-black z-10'>{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
    <div className='flex flex-col items-center gap-3 w-full h-full justify-center'>
      <DataBox 
        context={"Total Customers"}
        total={Math.max(...customerdata.map(obj => obj.customers))}
        icon={<HiUsers />}
        dataset={customerdata}/>
      <DataBox 
        context={"Total Order Recieved"}
        total={Math.max(...orderdata.map(obj => obj.value))}
        icon={<FaSuitcase />}
        dataset={orderdata} />
    </div>
    <p className='text-center pt-5 font-bold text-yellow-950'>Most Popular Ingredients in Cake -</p>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={730} height={300}>
        <Pie
          data={piedata}
          color="#000000"
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
        >
          {piedata.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
    </>
  );
}
