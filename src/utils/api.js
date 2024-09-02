import axios from "axios";

// Create an instance of axios
const api = axios.create({
  // baseURL: "http://10.10.10.79:3000/api",
  // baseURL: "https://backend.littlebonkers.xyz/api",
  baseURL: "https://preadmin.solenaswap.com/api",
  // baseURL: "http://localhost:9031/api",
  headers: {
    "Content-Type": "application/json",
  },
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => {
    if ([200, 201, 204].includes(res.status)) {
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
