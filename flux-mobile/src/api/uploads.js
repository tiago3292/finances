import api from "./axios";

export async function uploadFile(itemId, asset) {
    const formData = new FormData();

    formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? "comprovante.jpg",
        type: asset.mimeType ?? "image/jpeg",
    });

    const response = await api.post("/uploads/uploadfile", formData, {
        params: { item_id: itemId },
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
    });
    return response.data;
}

export async function deleteFile(filename) {
    const response = await api.delete("/uploads/deletefile", {
        params: { filename },
    });
    return response.data;
}