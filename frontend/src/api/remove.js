import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const removeFileFromServer = async (filename) => {
  try {
    await axios.post(`${SERVER_URL}/remove`, { filename });
  } catch (err) {
    console.error("Failed to delete file:", err);
  }
};
