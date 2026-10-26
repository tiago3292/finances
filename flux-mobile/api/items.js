import api from "./axios";

export async function getItems() {
    const response = await api.get("/items/");
    return response.data;
}

export async function createItem(item) {
    const response = await api.post("/items/", item);
    return response.data;
}

export async function updateItem(itemId, updatedFields) {
    const response = await api.put(`/items/${itemId}`, updatedFields, {
        params: { item_id: itemId },
    });
    return response.data;
}

export async function deleteItem(itemId) {
    const response = await api.delete(`/items/${itemId}`, {
        params: { item_id: itemId },
    });
    return response.data;
}