import axiosInstance from "./axiosConfig";

export async function login(email, password) {
    try {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function getuserByToken() {
    try {
    const response = await axiosInstance.get("/auth/getUser",);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}