import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const path =
            typeof window !== "undefined" ? window.location.pathname : "";

        if (status === 401 && path !== "/login") {
            window.location.href = "/login";
        } else if (status === 403 && path !== "/") {
            window.location.href = "/";
        } else if (status === 404 && path !== "/not-found") {
            window.location.href = "/not-found";
        }

        return Promise.reject(error);
    }
);
export default api;
