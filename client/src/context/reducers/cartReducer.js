
const cartReducer = (state = false, action) => {
    switch (action.type) {
        case 'TOGGLE_CART_STATE':
        return {
            ...state,
            isOpen: !state.isOpen,
        };
        default:
        return state;
    }
};

export default cartReducer;
  