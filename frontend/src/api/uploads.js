import api from "./axios";

export async function uploadFile(itemId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/uploads/uploadfile", formData, {
    params: { item_id: itemId },
  });
  return response.data;
}

export async function deleteFile(filename) {
  const response = await api.delete("/uploads/deletefile", {
    params: { filename },
  });
  return response.data;
}