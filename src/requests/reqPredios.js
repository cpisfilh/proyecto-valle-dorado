import axiosInstance from "./axiosConfig";

export async function getPredios() {
    try {
    const response = await axiosInstance.get("/predio");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function getPrediosSelectModal() {
    try {
    const response = await axiosInstance.get("/predio/getPrediosSelectModal");
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function getPrediosxCustomer(name) {
    try {
    const response = await axiosInstance.post("/predio/getPrediosxCustomer", { nombre: name });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postRelateClientProperty(idCliente,idPredio) {
    try {
    const response = await axiosInstance.post("/predio/relateClientProperty", { cliente_id: idCliente,predio_id:idPredio });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

export async function postRemoveRelateClientProperty(id) {
    try {
    const response = await axiosInstance.post("/predio/deleteXCustomer", { id });
    return response.data;
    } catch (error) {
     throw Error(error);
    }
}

