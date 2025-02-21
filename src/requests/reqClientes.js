import axiosInstance from "./axiosConfig";

export async function getClientes() {
    try {
    const response = await axiosInstance.get("/cliente");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}