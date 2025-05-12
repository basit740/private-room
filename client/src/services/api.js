import axios from "axios";

export const api = axios.create({
  baseURL: "https://urchin-app-ynpwz.ondigitalocean.app/api", // your backend port
});
