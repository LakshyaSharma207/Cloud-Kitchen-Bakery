import {combineReducers} from "redux";
import userReducer from "./userReducer";
import allUserReducer from './allUserReducers';
import cartReducer from "./cartReducer";

const myReducers = combineReducers({
    user: userReducer,
    allUsers: allUserReducer,
    cart: cartReducer,
})

export default myReducers;