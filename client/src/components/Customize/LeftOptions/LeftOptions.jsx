import React, { useState, useEffect } from 'react'
import Selection from '../Selection/Selection'
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../../config/firebase.config'
import { useSharedState } from '../SharedStateContext';
import { tempCake } from '../../../assets/index'

export default function LeftOptions() {
    const [data, setData] = useState([]);
    const db = getFirestore(app);
    const { sharedState, setSharedState } = useSharedState();

    const cakeType = ['Classic', 'Gluten-Free', 'Vegan', 'Nut-Free'];
    const cakeSizes = ['Regular', 'Medium', 'Large'];

    useEffect(() => {
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'Ingredients')); 
            const newData = [];
            
            querySnapshot.forEach((doc) => {
              newData.push({ 
                icon: doc.data().icon,
                in_stock: doc.data().in_stock,
                name: doc.data().name,
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

    function getIngredientsByType(type) {
        const typeListData = data.filter((ing) => ing.type === type);
        return typeListData.map((ing) => ing.name);
    } 
    useEffect(() => {
      setSharedState((prevState) => ({ ...prevState, selectedPrice: calculatePrice() }));
    }, [sharedState.selectedType, sharedState.selectedSize, sharedState.selectedToppings, sharedState.selectedFillings, sharedState.selectedSweetner, sharedState.selectedFlour]);

    function handleTypeChange(type) {
      setSharedState((prevState) => ({ ...prevState, selectedType: type }));
    }

    function handleSizeChange(size) {
        setSharedState((prevState) => ({ ...prevState, selectedSize: size }));
    }

    function handleToppingChange(topping) {
      if(isInStock(topping)) {
        const updatedToppings = sharedState.selectedToppings.includes(topping)
            ? sharedState.selectedToppings.filter((st) => st !== topping)
            : [...sharedState.selectedToppings, topping];
        setSharedState((prevState) => ({ ...prevState, selectedToppings: updatedToppings }));
      } else {
        console.log(`${topping} is out of stock`);
      }
    }

    function handleFillingChange(filling) {
      if(isInStock(filling)) {
        const updatedFillings = sharedState.selectedFillings.includes(filling)
            ? sharedState.selectedFillings.filter((st) => st !== filling)
            : [...sharedState.selectedFillings, filling];
        setSharedState((prevState) => ({ ...prevState, selectedFillings: updatedFillings }));
      } else {
        console.log(`${filling} is out of stock`);
      }
    }

    function handleSweetnerChange(sweetner) {
      if (isInStock(sweetner)) {
        setSharedState((prevState) => ({ ...prevState, selectedSweetner: sweetner }));
      } else {
        console.log(`${sweetner} is out of stock`);
      }
    }

    function handleFlourChange(flour) {
      if (isInStock(flour)) {
        setSharedState((prevState) => ({ ...prevState, selectedFlour: flour }));
      } else {
        console.log(`${flour} is out of stock`);
      }
    }

    function calculatePrice() {
        let totalPrice = 0;

        Object.entries(sharedState).forEach(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0 || !isNaN(value))) {
            // Do nothing if the value is empty
          } else {
            if (cakeType.includes(value)) {
              totalPrice += 100;
            } else if (value === 'Regular') {
              totalPrice += 50;
            } else if (value === 'Medium') {
              totalPrice += 100;
            } else if (value === 'Large') {
              totalPrice += 150;
            } else {
              totalPrice = getPrice(value, totalPrice);
            }
          }
        });
        return totalPrice;        
    }

    function getPrice(value, totalPrice) {
        data.map((a) => {
            if(value.includes(a.name)) totalPrice+=a.price;
        }); 
        return totalPrice;
    }
    function isInStock(item) {
      return data.some((ing) => ing.name === item && ing.in_stock > 0);
    }
    function getIcon(item) {
      const matchingItem = data.find((a) => a.name === item);
      return matchingItem ? matchingItem.icon : tempCake;
    }

  return (
    <div className="flex flex-col items-start justify-center p-12 absolute left-10 top-28 mx-auto max-w-2xl text-yellow-950">
        <Selection
        items={cakeType}
        selectedItems={sharedState.selectedType}
        handleSelectionChange={handleTypeChange}
        title="Select Cake Type:"
        />

        <Selection
        items={cakeSizes}
        selectedItems={sharedState.selectedSize}
        handleSelectionChange={handleSizeChange}
        title="Select Cake Size:"
        />

        <Selection
        items={getIngredientsByType('Flour')}
        selectedItems={sharedState.selectedFlour}
        handleSelectionChange={handleFlourChange}
        title="Select Flour:"
        />
        <div className='flex items-center justify-center gap-10 my-5'>
          <img 
            className="h-20 object-cover"
            src={getIcon(sharedState.selectedFlour)} 
            alt='cake image' 
          />
          <div>
            <p className='font-semibold ml-2'>Price: {getPrice(sharedState.selectedFlour, 0)}</p>
            <p className='font-semibold mx-2 mt-2 underline'>{isInStock(sharedState.selectedFlour) ? 'Available' : 'Not Available'}</p>
          </div>
        </div>
        
        <Selection
        items={getIngredientsByType('Topping')}
        selectedItems={sharedState.selectedToppings}
        handleSelectionChange={handleToppingChange}
        title="Select Toppings:"
        />
        <p className='text-gray-500 text-sm'>*Can Select Multiple Toppings</p>
        <div className='flex items-center justify-center gap-10 my-5'>
          <img 
            className="h-20 object-cover"
            src={getIcon(sharedState.selectedToppings.slice(-1)[0])} 
            alt='cake image' 
          />
          <div>
            <p className='font-semibold ml-2'>Price: {getPrice(sharedState.selectedToppings.slice(-1), 0)}</p>
            <p className='font-semibold mx-2 mt-2 underline'>{isInStock(sharedState.selectedToppings.slice(-1)[0]) ? 'Available' : 'Not Available'}</p>
          </div>
        </div>

        <Selection
        items={getIngredientsByType('Filling')}
        selectedItems={sharedState.selectedFillings}
        handleSelectionChange={handleFillingChange}
        title="Select Fillings:"
        />
        <p className='text-gray-500 text-sm'>*Can Select Multiple Fillings</p>
        <div className='flex items-center justify-center gap-10 my-5'>
          <img 
            className="h-20 object-cover"
            src={getIcon(sharedState.selectedFillings.slice(-1)[0])} 
            alt='cake image' 
          />
          <div>
            <p className='font-semibold ml-2'>Price: {getPrice(sharedState.selectedFillings.slice(-1), 0)}</p>
            <p className='font-semibold mx-2 mt-2 underline'>{isInStock(sharedState.selectedFillings.slice(-1)[0]) ? 'Available' : 'Not Available'}</p>
          </div>
        </div>
        
        <Selection
        items={getIngredientsByType('Sweetner')}
        selectedItems={sharedState.selectedSweetner}
        handleSelectionChange={handleSweetnerChange}
        title="Select Sweetner:"
        />
        <div className='flex items-center justify-center gap-10 my-5'>
          <img 
            className="h-20 object-cover"
            src={getIcon(sharedState.selectedSweetner)} 
            alt='cake image' 
          />
          <div>
            <p className='font-semibold ml-2'>Price: {getPrice([sharedState.selectedSweetner], 0)}</p>
            <p className='font-semibold mx-2 mt-2 underline'>{isInStock(sharedState.selectedSweetner) ? 'Available' : 'Not Available'}</p>
          </div>
        </div>
    </div>
  )
}
