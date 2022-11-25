import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
const API_FIELD = '/project_entities';

type ProjectEnity = {
  projectId: string;
  type: string;
  title: string;
  link: string;
  content: string;
  description: string;
};
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

async function postProjectEntity({ projectId, type, title, content }: ProjectEnity) {
  const headers = getHeaderFormData();
  const formData = new FormData();
  formData.append('projectId', projectId);
  formData.append('type', type);
  formData.append('title', title);
  formData.append('content', content);
  await axios({
    method: 'post',
    url: REACT_APP_API_URL + `/project_entities`,
    data: formData,
    headers: headers
  });
}
export const EnityAPI = {
  postProjectEntity: postProjectEntity
};
