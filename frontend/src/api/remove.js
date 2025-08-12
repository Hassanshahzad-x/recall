import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const removeFileFromServer = async (filename) => {
  try {
    await axios.post(`${SERVER_URL}/remove`, { filename });
  } catch (err) {
    console.error("Failed to delete file:", err);
  }
};

export const refreshFiles = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/refresh`);
    return response.data;
  } catch (err) {
    console.error("Failed to refresh files:", err);
    return [];
  }
};
