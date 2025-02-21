import axiosInstance from "./axiosConfig";

export async function getLotes() {
    try {
    const response = await axiosInstance.get("/lote");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}