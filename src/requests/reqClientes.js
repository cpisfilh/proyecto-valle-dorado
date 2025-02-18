const BaseUrl = import.meta.env.VITE_BASE_URL;
console.log(BaseUrl);
export async function getClientes() {
    const response = await fetch(`${BaseUrl}/clientes`);
    const data = await response.json();
    return data;
}