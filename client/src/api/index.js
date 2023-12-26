import axios from "axios";

export const baseURL = "http://localhost:5001/cloud-kitchen-bakery/us-central1/app"

export const validateUserJWTToken = async (token) => {
    try{
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers: {Authorization: "Bearer " + token}
        })
        return res.data.data;
    }catch(err) {
        return null;
    }
}

// get all users
export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch(err) {
        return null;
    }
}