import api from "./axios";

export async function getItems() {
    const response = await api.get("/items/myitems");
    return response.data;
}

export async function createItem(item) {
    const response = await api.post("/items/newitem", item);
    return response.data;
}

export async function updateItem(itemId, updatedFields) {
    const response = await api.put("/items/edititem", updatedFields, {
        params: { item_id: itemId },
    });
    return response.data;
}

export async function deleteItem(itemId) {
    const response = await api.delete("/items/deleteitem", {
        params: { item_id: itemId },
    });
    return response.data;
}