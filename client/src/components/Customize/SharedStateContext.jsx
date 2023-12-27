import { createContext, useContext, useState } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState({
    selectedType: '',
    selectedSize: '',
    selectedFlour: '',
    selectedToppings: [],
    selectedFillings: [],
    selectedSweetner: '',
    selectedPrice: 0,
  });

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  return useContext(SharedStateContext);
};
