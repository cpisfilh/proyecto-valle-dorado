import axiosInstance from "./axiosConfig";

export async function getProjects() {

    try {

        const response =
            await axiosInstance.get(
                "/proyecto"
            );

        return response.data;

    } catch (error) {

        throw Error(error);
    }
}
