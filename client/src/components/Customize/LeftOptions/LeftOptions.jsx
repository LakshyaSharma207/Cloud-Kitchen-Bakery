import React, { useState, useEffect } from 'react'
import Selection from '../Selection/Selection'
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../../config/firebase.config'
import { useSharedState } from '../SharedStateContext';

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

    function getIngredientsByType(type) {
        const typeListData = data.filter((ing) => ing.type === type);
        return typeListData.map((ing) => ing.name);
    } 
    useEffect(() => {
      setSharedState((prevState) => ({ ...prevState, selectedPrice: calculatePrice() }));
    }, [sharedState.selectedType, sharedState.selectedSize, sharedState.selectedToppings, sharedState.selectedFillings, sharedState.selectedSweetner]);

    function handleTypeChange(type) {
      setSharedState((prevState) => ({ ...prevState, selectedType: type }));
    }

    function handleSizeChange(size) {
        setSharedState((prevState) => ({ ...prevState, selectedSize: size }));
    }

    function handleToppingChange(topping) {
        const updatedToppings = sharedState.selectedToppings.includes(topping)
            ? sharedState.selectedToppings.filter((st) => st !== topping)
            : [...sharedState.selectedToppings, topping];
        setSharedState((prevState) => ({ ...prevState, selectedToppings: updatedToppings }));
    }

    function handleFillingChange(filling) {
        const updatedFillings = sharedState.selectedFillings.includes(filling)
            ? sharedState.selectedFillings.filter((st) => st !== filling)
            : [...sharedState.selectedFillings, filling];
        setSharedState((prevState) => ({ ...prevState, selectedFillings: updatedFillings }));
    }

    function handleSweetnerChange(sweetner) {
        setSharedState((prevState) => ({ ...prevState, selectedSweetner: sweetner }));
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
        items={getIngredientsByType('Topping')}
        selectedItems={sharedState.selectedToppings}
        handleSelectionChange={handleToppingChange}
        title="Select Toppings:"
        />
        <p className='text-gray-500 text-sm mb-5'>*Can Select Multiple Toppings</p>

        <Selection
        items={getIngredientsByType('Filling')}
        selectedItems={sharedState.selectedFillings}
        handleSelectionChange={handleFillingChange}
        title="Select Fillings:"
        />
        <p className='text-gray-500 text-sm mb-5'>*Can Select Multiple Fillings</p>
        
        <Selection
        items={getIngredientsByType('Sweetner')}
        selectedItems={sharedState.selectedSweetner}
        handleSelectionChange={handleSweetnerChange}
        title="Select Sweetner:"
        />
    </div>
  )
}
