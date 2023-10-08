import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:7001/",
    // baseURL: 'https://trade-accounting-demo.onrender.com', // Replace with your API's base URL
    headers: {
        'Content-Type': 'application/json', // Adjust content type as needed
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5173'
    },
});

export const serverInstance = instance