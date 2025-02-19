const BaseUrl = import.meta.env.VITE_BASE_URL;
export async function getClientes() {
    const response = await fetch(`${BaseUrl}/cliente`);
    const data = await response.json();
    return data;
}