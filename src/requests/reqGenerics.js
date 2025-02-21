import axiosInstance from "./axiosConfig";

export async function create(body,path) {
    const response = await axiosInstance.post(`${path}`, body);
    return response.data;
}

export async function update(body,path) {
    const response = await axiosInstance.post(`${path}`, body);
    return response.data;
}

export async function remove(body,path) {
    const response = await axiosInstance.post(`${path}`, body);
    return response.data;
}