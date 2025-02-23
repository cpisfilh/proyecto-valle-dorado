import axiosInstance from "./axiosConfig";

export async function getPredios() {
    try {
    const response = await axiosInstance.get("/predio");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}