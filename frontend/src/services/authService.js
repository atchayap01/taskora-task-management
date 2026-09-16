import api from "./api";

// Extracts a readable error message from an axios error, falling back to a
// generic message when the backend didn't send one (e.g. network failure).
const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return "Could not reach the server. Please check your connection.";
  }
  return "Something went wrong. Please try again.";
};

export const registerUser = async (name, email, password, confirmPassword) => {
  try {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export { getErrorMessage };
