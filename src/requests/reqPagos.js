import axiosInstance from "./axiosConfig";

export async function getPagos() {
    try {
    const response = await axiosInstance.get("/pago");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function getPago(id) {
    try {
    const response = await axiosInstance.post(`/pago/getOne`, { id });
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

export async function postEditPago(data) {
    try {
    const response = await axiosInstance.post("/pago/edit", data);
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postDeletePago(data) {
    try {
    const response = await axiosInstance.post("/pago/delete", { id: data });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postSearchPagos(data) {
    try {
    const response = await axiosInstance.post("/pago/search", { nombre: data });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postEditCurrentBalance(id,data) {
    try {
    const response = await axiosInstance.post("/pago/updateBalance", { id,data });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

