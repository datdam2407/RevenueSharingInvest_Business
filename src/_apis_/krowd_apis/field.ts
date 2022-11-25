import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
const API_FIELD = '/fields';
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
async function gets() {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + API_FIELD, {
    headers: headers
  });
  return response;
}
async function get({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_FIELD}/${id}`, {
    headers: headers
  });
  return response;
}
export const FieldAPI = {
  gets: gets,
  get: get
};
