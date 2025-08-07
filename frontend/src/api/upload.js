import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function uploadFileToServer(formData) {
  try {
    const response = await axios.post(`${SERVER_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {},
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "File upload failed");
  }
}
