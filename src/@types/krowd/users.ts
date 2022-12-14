export enum ROLE_USER_TYPE {
  BUSINESS_MANAGER = 'BUSINESS_MANAGER',
  INVESTOR = 'INVESTOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER'
}
export type UserKrowd = {
  id: string;
  business: Business;
  role: Role;
  description: string;
  phoneNum: string;
  idCard: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  taxIdentificationNumber: string;
  city: string;
  district: string;
  address: string;
  bankName: string;
  bankAccount: string;
  image: string;
  status: string;
  createDate: string;
  createBy: string;
  updateDate: string;
  updateBy: string;
  isDeleted: boolean;
  lastName: string;
  firstName: string;
};

export type Business = {
  id: string;
  manager: null;
  fieldList: null;
  image: string;
  numOfProject: number;
  numOfSuccessfulProject: number;
  successfulRate: number;
  status: string;
  createDate: string;
  createBy: string;
  updateDate: string;
  updateBy: string;
  isDeleted: boolean;
  name: string;
  phoneNum: string;
  email: string;
  description: string;
  taxIdentificationNumber: string;
  address: string;
};

export type Role = {
  id: string;
  name: ROLE_USER_TYPE;
  description: string;
  createDate: string;
  createBy: null;
  updateDate: string;
  updateBy: null;
  isDeleted: boolean;
};
//================================NOTIFICATION=============================
export type Notification = {
  total: number;
  new: number;
  details: NotificationDetail[];
};

export type NotificationDetail = {
  title: string;
  entityId: string;
  image: string;
  createDate: string;
  seen: boolean;
};
