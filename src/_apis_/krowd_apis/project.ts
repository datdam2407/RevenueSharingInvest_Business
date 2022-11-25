import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
const API_FIELD = '/projects';
const API_SUBMIT = '/projects/status';
const API_ALL_PE = '/project_entities/project';
const API_PACKAGE = '/packages/project';
const API_PACKAGE_ID = '/packages';
const API_PE = '/project_entities';
const API_DEL_PK = '/packages';
const API_VOUCHER = '/vouchers';

function getToken() {
  return window.localStorage.getItem('accessToken');
}
type VoucherPost = {
  projectId: string;
  name: string;
  code: string;
  quantity: string;
  description: string;
};
function getHeaderFormData() {
  const token = getToken();
  return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
}
function getHeader() {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
}
async function gets(params?: {
  businessId: string;
  status: string;
  pageIndex: number;
  pageSize: 10;
}) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + API_FIELD, {
    params: params,
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
async function getAllProjectEntity({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_ALL_PE}/${id}`, {
    headers: headers
  });
  return response;
}
async function submitProject({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios({
    method: 'put',
    url: REACT_APP_API_URL + `${API_SUBMIT}/${id},WAITING_FOR_APPROVAL`,
    headers: headers
  });
  return response;
}
async function changeStatusProject({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios({
    method: 'put',
    url: REACT_APP_API_URL + `${API_SUBMIT}/${id},DRAFT`,
    headers: headers
  });
  return response;
}
async function getAllProjectVoucher() {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_VOUCHER}`, {
    headers: headers
  });
  return response;
}
async function getProjectPackage({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_PACKAGE}/${id}`, {
    headers: headers
  });
  return response;
}
async function getPackageID({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_PACKAGE_ID}/${id}`, {
    headers: headers
  });
  return response;
}
async function getProjectEntityID({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_PE}/${id}`, {
    headers: headers
  });
  return response;
}
async function delProjectEntityID({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.delete(REACT_APP_API_URL + `${API_PE}/${id}`, {
    headers: headers
  });
  return response;
}
async function delPackageID({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.delete(REACT_APP_API_URL + `${API_DEL_PK}/${id}`, {
    headers: headers
  });
  return response;
}
async function postVoucher({ projectId, name, code, quantity, description }: VoucherPost) {
  const headers = getHeader();
  const body = {
    projectId: projectId,
    name: name,
    code: code,
    quantity: quantity,
    description: description
  };
  await axios({
    method: 'post',
    url: REACT_APP_API_URL + API_VOUCHER,
    data: body,
    headers: headers
  });
}
export const ProjectAPI = {
  gets: gets,
  get: get,
  getProjectPackage: getProjectPackage,
  getProjectEntityID: getProjectEntityID,
  submitProject: submitProject,
  getAllProjectEntity: getAllProjectEntity,
  getPackageID: getPackageID,
  delProjectEntityID: delProjectEntityID,
  delPackageID: delPackageID,
  getAllProjectVoucher: getAllProjectVoucher,
  postVoucher: postVoucher,
  changeStatusProject: changeStatusProject
};
