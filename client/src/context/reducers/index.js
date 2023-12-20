import {combineReducers} from "redux";
import userReducer from "./userReducer";
import allUserReducer from './allUserReducers';

const myReducers = combineReducers({
    user: userReducer,
    allUsers: allUserReducer,
})

export default myReducers;