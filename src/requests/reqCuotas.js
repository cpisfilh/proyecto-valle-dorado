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

export async function uploadReceipt(
  cuotaId,
  file,
  onUploadProgress
) {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "cuota_id",
    cuotaId
  );

  const response =
    await axiosInstance.post(
      "/cuota/uploadReceipt",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        onUploadProgress,
      }
    );

  return response.data;
}

export async function getReceiptUrl(
  cuotaId
) {

  const response =
    await axiosInstance.get(
      `/cuota/getReceiptUrl/${cuotaId}`
    );

  return response.data;
}
