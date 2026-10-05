import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.API_URL || "https://api.rawg.io/api",
    params: {
        key: import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || "1e05fb680785431f9a77a96587185e3e",
    },
});