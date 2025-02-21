import axiosInstance from "./axiosConfig";

export async function getManzanas() {
    try {
    const response = await axiosInstance.get("/manzana");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}