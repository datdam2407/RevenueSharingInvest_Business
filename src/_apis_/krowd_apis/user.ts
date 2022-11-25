import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
const API_FIELD = '/users';
const API_INVESTOR_LIST = '/users/investor';
const API_PROJECT_MANAGER_LIST = '/users/project_manager';
const API_NOTIFICATION = '/notifications';
type PMFormPost = {
  firstName: string;
  lastName: string;
  email: string;
  businessId: string;
};
type MyProfilePut = {
  id: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  phoneNum: string | null | undefined;
  address: string | null | undefined;
  district: string | null | undefined;
  city: string | null | undefined;
  bankAccount: string | null | undefined;
  bankName: string | null | undefined;
  dateOfBirth: string | null | undefined;
  idCard: string | null | undefined;
  gender: string | null | undefined;
  taxIdentificationNumber: string | null | undefined;
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

async function postPM({ email, firstName, lastName, businessId }: PMFormPost) {
  const headers = getHeader();
  const body = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    businessId: businessId
  };
  await axios({
    method: 'post',
    url: REACT_APP_API_URL + API_FIELD,
    data: body,
    headers: headers
  });
}
async function putMyProfile({
  id,
  firstName,
  lastName,
  phoneNum,
  address,
  district,
  city,
  bankAccount,
  bankName,
  dateOfBirth,
  idCard,
  gender,
  taxIdentificationNumber
}: MyProfilePut) {
  if (!id) throw new Error('No user to update profile');
  const headers = getHeaderFormData();
  const formData = new FormData();
  formData.append('firstName', firstName ?? '');
  formData.append('lastName', lastName ?? '');
  formData.append('phoneNum', `${phoneNum}` ?? '');
  formData.append('address', address ?? '');
  formData.append('district', district ?? '');
  formData.append('city', city ?? '');
  formData.append('bankAccount', bankAccount ?? '');
  formData.append('gender', gender ?? '');
  formData.append('bankName', bankName ?? '');
  formData.append('idCard', idCard ?? '');
  formData.append('dateOfBirth', dateOfBirth ?? '');
  formData.append('taxIdentificationNumber', taxIdentificationNumber ?? '');
  await axios({
    method: 'put',
    url: REACT_APP_API_URL + `${API_FIELD}/${id}`,
    data: formData,
    headers: headers
  });
}
async function getUserID({ id }: { id: string }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_FIELD}/${id ?? 'null'}`, {
    headers: headers
  });
  return response;
}
async function getInvestorList(params: {
  pageIndex: number;
  pageSize: number;
  projectId: string;
  status: string;
}) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_INVESTOR_LIST}`, {
    headers: headers,
    params: params
  });
  return response;
}
async function getProjectManagerList(params: {
  pageIndex: number;
  pageSize: number;
  businessId: string;
  projectId: string;
  status: string;
}) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_PROJECT_MANAGER_LIST}`, {
    headers: headers,
    params: params
  });
  return response;
}
async function getNotification(params: { userId: string; seen: boolean }) {
  const headers = getHeader();
  const response = await axios.get(REACT_APP_API_URL + `${API_NOTIFICATION}`, {
    headers: headers,
    params: params
  });
  return response;
}
export const UserAPI = {
  postPM: postPM,
  putMyProfile: putMyProfile,
  getUserID: getUserID,
  getInvestorList: getInvestorList,
  getProjectManagerList: getProjectManagerList,
  getNotification: getNotification
};
