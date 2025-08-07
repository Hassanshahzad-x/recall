import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function askQuestion(query) {
  try {
    const response = await axios.post(
      `${SERVER_URL}/ask`,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Answer fetching failed");
  }
}

// Assessing_Security_Solutions_for_SmartSoft.pdf
// what is network access control NAC?
