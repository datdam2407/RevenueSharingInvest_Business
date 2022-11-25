import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
const API_FIELD = '/project_entities';
function getToken() {
  return window.localStorage.getItem('accessToken');
}

function getHeaderFormData() {
  const token = getToken();
  return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
}
function getHeader() {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
}
async function gets(params?: { businessId: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + API_FIELD, {
    params: params,
    headers: headers
  });
  return response;
}
async function post() {
  const headers = getHeader();
  const response = await axios.post(REACT_APP_API_URL + `/${API_FIELD}`, {
    headers: headers
  });
  return response;
}
export const ProjectAPI = {
  gets: gets,
  post: post
};
