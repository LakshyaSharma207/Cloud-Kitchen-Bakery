export function setAllUserDetails(data) {
    return {
        type: "SET_ALL_USER",
        allUsers: data,
    }
}

export function getAllUserDetails(data) {
    return {
        type: "GET_ALL_USERS",
    }
}