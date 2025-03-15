import axiosInstance from "./axiosConfig";

export async function getPagos() {
    try {
    const response = await axiosInstance.get("/pago");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postCreatePago(data) {
    try {
    const response = await axiosInstance.post("/pago/create", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

