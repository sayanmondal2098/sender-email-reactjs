import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

let defaultHeaders = {
  grant_type: "client_credentials",
  // client_id: localStorage.getItem("api_host"),
  // client_secret: localStorage.getItem("api_key"),
  client_id: process.env.REACT_APP_API_CLIENT,
  client_secret: process.env.REACT_APP_API_SECRET,
  params: {},
  headers: {}
};

const getToken = () => {
  return axios.post(`${URL}/oauth/access_token`, defaultHeaders);
};

const getTemplates = token => {
  defaultHeaders.params = {
    owner: "me"
  };

  defaultHeaders.headers = {
    Authorization: "Bearer " + token
  };

  return axios.get(`${URL}/templates`, defaultHeaders);
};

const sendEmail = (email, token) => {
  defaultHeaders.params = {};
  defaultHeaders.headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  };

  return axios.post(`${URL}/smtp/emails`, { email }, defaultHeaders);
};
export { getToken, getTemplates, sendEmail };
