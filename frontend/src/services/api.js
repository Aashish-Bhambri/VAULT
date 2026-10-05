import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.API_URL,
    params: {
        key: import.meta.env.API_KEY,
    },
});