const BaseUrl = import.meta.env.VITE_BASE_URL;

export async function create(body,path) {
    const response = await fetch(`${BaseUrl}/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    const data = await response.json();
    return data;
}

export async function remove(body,path) {
    const response = await fetch(`${BaseUrl}/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    const data = await response.json();
    return data;
}