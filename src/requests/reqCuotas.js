import axiosInstance from "./axiosConfig";

export async function getCuotas() {
    try {
    const response = await axiosInstance.get("/cuota");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postCreateCuota(data) {
    try {
    const response = await axiosInstance.post("/cuota/create", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}
export async function postCreateCuotaInicial(data) {
    try {
    const response = await axiosInstance.post("/cuota/createCuotaInicial", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}
export async function postCreateCuotaMensual(data) {
    try {
    const response = await axiosInstance.post("/cuota/createCuotaMensual", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postEditCuota(data) {
    try {
    const response = await axiosInstance.post("/cuota/edit", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postEditCuotaMensual(data) {
    try {
    const response = await axiosInstance.post("/cuota/editMensual", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postDeleteCuota(data) {
    try {
    const response = await axiosInstance.post("/cuota/delete", { id: data });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function getFirstToExpire() {
    try {
    const response = await axiosInstance.get("/cuota/getFirstToExpire");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postGenerarCuotas(data) {
    try {
    const response = await axiosInstance.post("/cuota/cuotasGenerate",data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}
